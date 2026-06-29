import pool from "../db";
import { Request,Response } from "express";
import { Booking,ApiResponse,CreateBookingBody, Rooms } from "../types/types";


export const getBookings = async(req:Request,res:Response<ApiResponse<Booking[] | null>>)=>{
  const sql = "SELECT * FROM bookings;";
  try {
    const result = await pool.query<Booking>(sql);
    if(result.rows.length === 0){
      return res.status(404).json({success:false,message:"No booking found!",data:null});
    }
    return res.status(200).json({success:true,message:"Booking fetched successfully",data:result.rows})
  } catch (error) {
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }
}

export const getBookingById =async(req:Request<{id:string}>,res:Response<ApiResponse<Booking | null>>)=>{
  const id = Number(req.params.id);
  const sql = "SELECT * FROM bookings WHERE id = $1;";
  try {
    const result = await pool.query<Booking>(sql,[id]);
    if(result.rowCount === 0){
      return res.status(404).json({success:false,message:"No booking found!",data:null});
    }
    return res.status(200).json({success:true,message:"Booking fetched successfully",data:result.rows[0]})
  } catch (error) {
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }
}

export const createBooking = async(req:Request<{},{},CreateBookingBody>,res:Response<ApiResponse<Booking | null>>)=>{
  const {guest_id,room_id,check_in,check_out}=req.body;
  const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,total_price,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *;";
  const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
  const update_room_sql = "UPDATE rooms SET is_available= $1 WHERE id =$2;";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const room_detail = await client.query<Rooms>(check_room_sql,[room_id]);
    if(room_detail.rowCount === 0){
      await client.query("ROLLBACK")
      return res.status(404).json({success:false,message:"Room not found!",data:null})
    }
    const room_available = room_detail.rows[0].is_available;
    if(!room_available){
      await client.query("ROLLBACK");
      return res.status(400).json({success:false,message:"Room is not available!",data:null});
    }
    const check_in_date = new Date(check_in);
    const check_out_date = new Date(check_out);
    const oneDay = 1000 * 60 * 60 * 24;
    if(check_in_date >= check_out_date){
      await client.query("ROLLBACK");
      return res.status(400).json({success:false,message:"Check-in date must be before check-out date!",data:null})
    }
    const diffInTime = check_out_date.getTime()-check_in_date.getTime(); 
    const total_day = Math.round(diffInTime/oneDay);

    const roomPrice = room_detail.rows[0].price;
    const total_price = roomPrice * total_day;
    const result =  await client.query<Booking>(sql,[guest_id,room_id,check_in,check_out,total_price,"confirmed"]);
    if(result.rowCount === 0){
        await client.query("ROLLBACK");
      return res.status(500).json({success:false,message:"Insertion problem!",data:null})
    }
      await client.query(update_room_sql,[false,room_id]);
      await client.query("COMMIT");
      return res.status(201).json({success:true,message:"Room booked successfully!",data:result.rows[0]});
  } catch (error) {
    await client.query('ROLLBACK');
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }finally{
    client.release();
  }
}

export const updateBooking = async (req:Request<{id:string}>,res:Response<ApiResponse<Booking | null>>)=>{
  const id = Number(req.params.id);
  const booking_detail_sql = "SELECT * FROM bookings WHERE id=$1;";
  const sql = "UPDATE bookings SET status = $1 WHERE id=$2 RETURNING *;";
  const update_room_available_sql = "UPDATE rooms SET is_available =$1 WHERE id=$2 ;";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const booking_detail = await client.query(booking_detail_sql,[id]);
    if(booking_detail.rowCount === 0 ){
      return res.status(404).json({success:false,message:"Booking not found!",data:null});
    }
    if(booking_detail.rows[0].status === "cancelled"){
      await client.query("ROLLBACK")
      return res.status(400).json({success:false,message:"Already cancelled room!",data:null});
    }
    const result = await client.query<Booking>(sql,["cancelled",id]);
    if(result.rowCount === 0){
      await client.query("ROLLBACK");
      return res.status(400).json({success:false,message:"Updation problem!",data:null});
    }
    const room_id = result.rows[0].room_id;
    await client.query(update_room_available_sql,[true,room_id]);
    await client.query("COMMIT");
    return res.status(200).json({success:true,message:"Booking cancelled!",data:result.rows[0]})
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }finally{
    client.release()
  }
}

export const getBookingByGuestId = async(req:Request<{guestId:string}>,res:Response<ApiResponse<Booking[] | null>>)=>{
  const guestId = Number(req.params.guestId);
  const sql = "SELECT * FROM bookings WHERE guest_id=$1;";
  try {
    const result = await pool.query(sql,[guestId]);
    if(result.rowCount === 0){
      return res.status(404).json({success:false,message:"No guest found with booking!",data:null});
    }
    return res.status(200).json({success:true,message:"Guest found with booking!",data:result.rows});
  } catch (error) {
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }
}