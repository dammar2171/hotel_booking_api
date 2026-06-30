import { Request,Response } from "express"
import { ApiResponse, Stats } from "../types/types"
import pool from "../db";

export const getStats = async(req:Request,res:Response<ApiResponse<Stats | null>>)=>{
  try {
    const roomStat = await pool.query(`
      SELECT
        COUNT(*) as total_rooms
        COUNT(*) FILTER(WHERE is_available=true) as available_rooms
        COUNT(*) FILTER(WHERE is_available=false) as occupied_rooms
      FROM rooms;
      `);
    const guestStat = await pool.query(`
        SELECT COUNT(*) as total_guests FROM guests;
      `);
    const bookingStat = await pool.query(`
        SELECT 
          COUNT(*) as total_booking
          COUNT(*) FILTER(WHERE status='cancelled') as cancelled_booking
          COUNT(*) FILTER(WHERE status='confirmed') as confirmed_booking
          COALESCE(SUM(total_price),0) FILTER(WHERE status='confirmed') as total_revenue
        FROM bookings;
      `);
    const totalRooms = Number(roomStat.rows[0].total_rooms);
    const availableRooms = Number(roomStat.rows[0].available_rooms);
    const occupiedRooms = Number(roomStat.rows[0].available_rooms);

    const occupancyRate = totalRooms ===0 ? 0 : Math.round((totalRooms/occupiedRooms)*100);
    
    const stat:Stats ={
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalGuests : Number(guestStat.rows[0].total_guests),
      totalBooking : Number(bookingStat.rows[0].total_booking),
      cancelledBooking : Number(bookingStat.rows[0].cancelled_booking),
      confirmedBooking : Number(bookingStat.rows[0].cancelled_booking),

    }
  } catch (error) {
    console.log("DATABASE_ERROR: ",error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
      data:null
    })
  }
}