import pool from "../config/db";
import { NextFunction, Request,Response } from "express";
import { Booking,ApiResponse,CreateBookingBody, Rooms, PaginatedResponse, PaginationQuery } from "../types/types";
import { buildPaginationMeta, getPagination } from "../utils/pagination";
import { AppError } from "../utils/AppError";


export const getBookings = async(req:Request<{},{},{},PaginationQuery>,res:Response<PaginatedResponse<Booking>>,next:NextFunction)=>{
  const {currentPage,pageLimit,offset} = getPagination(req.query.page,req.query.limit);
  try {
    const totalCount = await pool.query(" SELECT COUNT(*) as total FROM bookings");
    const totalItem = Number(totalCount.rows[0].total);
    const sql = "SELECT * FROM bookings ORDER BY id limit $1 OFFSET $2;";
    const result = await pool.query<Booking>(sql,[pageLimit,offset]);
    return res.status(200).json({
      success:true,
      message:result.rows.length ===0 ? "No booking found!":"Booking fetched successfully!",
      data:result.rows,
      pagination:buildPaginationMeta(currentPage,pageLimit,totalItem)
    })
  } catch (error) {
    next(error)
  }
}

export const getBookingById =async(req:Request<{id:string}>,res:Response<ApiResponse<Booking | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const sql = "SELECT * FROM bookings WHERE id = $1;";
  try {
    const result = await pool.query<Booking>(sql,[id]);
    if(result.rowCount === 0){
      throw new AppError("No booking found!",404);
    }
    return res.status(200).json({success:true,message:"Booking fetched successfully",data:result.rows[0]})
  } catch (error) {
    next(error)
  }
}

export const createBooking = async(req:Request<{},{},CreateBookingBody>,res:Response<ApiResponse<Booking | null>>,next:NextFunction)=>{
  const {guest_id,room_id,check_in,check_out,guests,paymentMethod,specialRequest}=req.body;
  const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,total_price,status,guests,payment_method,special_request)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;";
  const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
  const update_room_sql = "UPDATE rooms SET is_available= $1 WHERE id =$2;";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const room_detail = await client.query<Rooms>(check_room_sql,[room_id]);
    if(room_detail.rowCount === 0){
      await client.query("ROLLBACK")
      throw new AppError("Room not found!",404);
    }
    const room_available = room_detail.rows[0].is_available;
    if(!room_available){
      await client.query("ROLLBACK");
      throw new AppError("Room is not available!",400);
    }
    const check_in_date = new Date(check_in);
    const check_out_date = new Date(check_out);
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = check_out_date.getTime()-check_in_date.getTime(); 
    const total_day = Math.round(diffInTime/oneDay);

    const roomPrice = room_detail.rows[0].price;
    const total_price = roomPrice * total_day;
    const result =  await client.query<Booking>(sql,[guest_id,room_id,check_in,check_out,total_price,"confirmed",guests,paymentMethod,specialRequest]);
    if(result.rowCount === 0){
      await client.query("ROLLBACK");
      throw new AppError("Insertion problem!",500);
    }
      await client.query(update_room_sql,[false,room_id]);
      await client.query("COMMIT");
      return res.status(201).json({success:true,message:"Room booked successfully!",data:result.rows[0]});
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  }finally{
    client.release();
  }
}

export const cancelBooking = async (req:Request<{id:string}>,res:Response<ApiResponse<Booking | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const booking_detail_sql = "SELECT * FROM bookings WHERE id=$1;";
  const sql = "UPDATE bookings SET status = $1 WHERE id=$2 RETURNING *;";
  const update_room_available_sql = "UPDATE rooms SET is_available =$1 WHERE id=$2 ;";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const booking_detail = await client.query(booking_detail_sql,[id]);
    if(booking_detail.rowCount === 0 ){
      throw new AppError("Booking not found!",404);
    }
    if(booking_detail.rows[0].status === "cancelled"){
      throw new AppError("Already cancelled room!",400);
    }
    const result = await client.query<Booking>(sql,["cancelled",id]);
    if(result.rowCount === 0){
      await client.query("ROLLBACK");
      throw new AppError("Updation problem!",404);
    }
    const room_id = result.rows[0].room_id;
    await client.query(update_room_available_sql,[true,room_id]);
    await client.query("COMMIT");
    return res.status(200).json({success:true,message:"Booking cancelled!",data:result.rows[0]})
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  }finally{
    client.release()
  }
}

export const getBookingByGuestId = async(req:Request<{guestId:string}>,res:Response<ApiResponse<Booking[] | null>>,next:NextFunction)=>{
  const guestId = Number(req.params.guestId);
  const sql = "SELECT * FROM bookings WHERE guest_id=$1;";
  try {
    const result = await pool.query(sql,[guestId]);
    if(result.rowCount === 0){
      throw new AppError("No guest found with booking!",404);
    }
    return res.status(200).json({success:true,message:"Guest found with booking!",data:result.rows});
  } catch (error) {
    next(error)
  }
}