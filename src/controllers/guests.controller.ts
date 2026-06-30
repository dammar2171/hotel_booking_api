import { Request, Response } from "express";
import pool from "../db";
import { Guests, ApiResponse, CreateGuestBody, Booking, PaginationQuery, PaginatedResponse } from "../types/types";
import { buildPaginationMeta, getPagination } from "../utils/pagination";

export const getGuests = async (req: Request<{},{},{},PaginationQuery>, res: Response<PaginatedResponse<Guests>>) => {
  const {currentPage,pageLimit,offset}=getPagination(req.query.page,req.query.limit);
  try {
    const totalGuests = await pool.query("SELECT COUNT(*) as total FROM guests");
    const totalItem = Number(totalGuests.rows[0].total);
    const sql = "SELECT * FROM guests ORDER BY id LIMIT $1 OFFSET $2;";
    const result = await pool.query<Guests>(sql,[pageLimit,offset]);
    return res.status(200).json({ 
      success: true, 
      message: result.rows.length === 0 ? "Guests not found!" : "Guests fetched successfully!", 
      data: result.rows,
      pagination:buildPaginationMeta(currentPage,pageLimit,totalItem), 
    });
  } catch (error) {
    console.log("DATABASE_ERROR: ", error);
    return res.status(500).json({ 
      success: false, message: 
      "Internal server error!", 
      data: [],
      pagination: buildPaginationMeta(1,10,0) 
    });
  }
};

export const getGuestById = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM guests WHERE id =$1;";
  try {
    const result = await pool.query<Guests>(sql, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Guest not found!", data: null });
    }
    return res.status(200).json({ success: true, message: "Guest found successfully!", data: result.rows[0] });
  } catch (error) {
    console.log("DATABASE_ERROR: ", error);
    return res.status(500).json({ success: false, message: "Internal server error!", data: null });
  }
};

export const createGuest = async (req: Request<{}, {}, CreateGuestBody>, res: Response<ApiResponse<Guests | null>>) => {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO guests(name,email,phone) VALUES($1,$2,$3) RETURNING *;";
  try {
    const result = await pool.query<Guests>(sql, [name, email, phone]);
    if (result.rowCount === 0) {
      return res.status(500).json({ success: false, message: "Insertion problem!", data: null });
    }
    return res.status(201).json({ success: true, message: "Guest inserted successfully!", data: result.rows[0] });
  } catch (error) {
    console.log("DATABASE_ERROR: ", error);
    return res.status(500).json({ success: false, message: "Internal server error!", data: null });
  }
};

export const updateGuest = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>) => {
  const { name, email, phone } = req.body;
  const id = Number(req.params.id);
  const sql = "UPDATE guests SET name=COALESCE($1,name),email=COALESCE($2,email),phone=COALESCE($3,phone) WHERE id=$4 RETURNING *;";
  try {
    const result = await pool.query<Guests>(sql, [name, email, phone, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Guest not found!", data: null });
    }
    return res.status(200).json({ success: true, message: "Guest updated successfully!", data: result.rows[0] });
  } catch (error) {
    console.log("DATABASE_ERROR: ", error);
    return res.status(500).json({ success: false, message: "Internal server error!", data: null });
  }
};

export const deleteGuest = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM guests WHERE id=$1 RETURNING *;";
  const find_booking_sql = "SELECT * FROM bookings WHERE guest_id =$1;";
  try {
    const booking_detail = await pool.query<Booking>(find_booking_sql, [id]);
    if ((booking_detail.rowCount ?? 0) > 0) {
      return res.status(400).json({ success: false, message: "Cannot delete guest with existing bookings", data: null });
    }
    const result = await pool.query<Guests>(sql, [id]);
    if (result.rowCount === 0) {
      return res.status(500).json({ success: false, message: "Deletion problem!", data: null });
    }
    return res.status(200).json({ success: true, message: "Guest deleted successfully!", data: result.rows[0] });
  } catch (error) {
    console.log("DATABASE_ERROR: ", error);
    return res.status(500).json({ success: false, message: "Internal server error!", data: null });
  }
};
