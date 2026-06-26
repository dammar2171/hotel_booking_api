import pool from "../db";
import { Router,Request,Response } from "express";
import { Booking,ApiResponse,CreateBookingBody, Rooms } from "../types";
import { json } from "node:stream/consumers";

const router = Router();

router.get("/", async(req:Request,res:Response<ApiResponse<Booking[] | null>>)=>{
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
})

router.get("/:id", async(req:Request<{id:string}>,res:Response<ApiResponse<Booking | null>>)=>{
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
})

router.post("/", async(req:Request<{},{},CreateBookingBody>,res:Response<ApiResponse<Booking | null>>)=>{
  const {guest_id,room_id,check_in,check_out,price,status}=req.body;
  const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,price,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *;";
  const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
  try {
    const room_detail = await pool.query<Rooms>(check_room_sql,[room_id]);
    if(room_detail.rowCount === 0){
      return res.status(404).json({success:false,message:"Room not found!",data:null})
    }
    const room_available = room_detail.rows[0].is_available;
    if(!room_available){
      return res.status(400).json({success:false,message:"Room is not available!",data:null});
    }
    const check_in_date = new Date(check_in);
    const check_out_date = new Date(check_out);
    const oneDay = 1000 * 60 * 60 * 24;
     const diffInTime = Math.abs(check_in_date.getTime() - check_out_date.getTime()); 
    const total_day = Math.round(diffInTime/oneDay);

    const total_price = price * total_day;
    
    if(check_in_date >= check_out_date){
      return res.status(400).json({success:false,message:"Check-in date must be before check-out date!",data:null})
    }
    
  } catch (error) {
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({success:false,message:"Internal server problem",data:null})
  }
})

export default router;