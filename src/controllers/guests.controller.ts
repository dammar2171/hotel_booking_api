import { NextFunction, Request, Response } from "express";
import pool from "../config/db";
import { Guests, ApiResponse, CreateGuestBody, Booking, PaginationQuery, PaginatedResponse } from "../types/types";
import { buildPaginationMeta, getPagination } from "../utils/pagination";
import { AppError } from "../utils/AppError";

export const getGuests = async (req: Request<{},{},{},PaginationQuery>, res: Response<PaginatedResponse<Guests>>,next:NextFunction) => {
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
    next(error)
  }
};

export const getGuestById = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>,next:NextFunction) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM guests WHERE id =$1;";
  try {
    const result = await pool.query<Guests>(sql, [id]);
    if (result.rowCount === 0) {
     throw new AppError("Guest not found!",404);
    }
    return res.status(200).json({ success: true, message: "Guest found successfully!", data: result.rows[0] });
  } catch (error) {
    next(error)
  }
};

export const getGuestByUserId = async (req:Request<{userId:string}>, res:Response<ApiResponse<Guests>>, next:NextFunction) => {
  const userId = Number(req.params.userId);
  try {
    const result = await pool.query(
      "SELECT * FROM guests WHERE user_id = $1", [userId]
    );
    if (result.rowCount === 0) {
      throw new AppError("Guest profile not found!", 404);
    }
    return res.status(200).json({
      success: true,
      message: "Guest found!",
      data:    result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const createGuest = async (req: Request<{}, {}, CreateGuestBody>, res: Response<ApiResponse<Guests | null>>,next:NextFunction) => {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO guests(name,email,phone) VALUES($1,$2,$3) RETURNING *;";
  try {
    const result = await pool.query<Guests>(sql, [name, email, phone]);
    return res.status(201).json({ success: true, message: "Guest inserted successfully!", data: result.rows[0] });
  } catch (error) {
    next(error)
  }
};

export const updateGuest = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>,next:NextFunction) => {
  const { name, email, phone } = req.body;
  const id = Number(req.params.id);
  const sql = "UPDATE guests SET name=COALESCE($1,name),email=COALESCE($2,email),phone=COALESCE($3,phone) WHERE id=$4 RETURNING *;";
  try {
    const result = await pool.query<Guests>(sql, [name, email, phone, id]);
    if (result.rowCount === 0) {
      throw new AppError("Guest not found!",404);
    }
    return res.status(200).json({ success: true, message: "Guest updated successfully!", data: result.rows[0] });
  } catch (error) {
    next(error)
  }
};

export const deleteGuest = async (req: Request<{ id: string }>, res: Response<ApiResponse<Guests | null>>,next:NextFunction) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM guests WHERE id=$1 RETURNING *;";
  const find_booking_sql = "SELECT * FROM bookings WHERE guest_id =$1;";
  try {
    const booking_detail = await pool.query<Booking>(find_booking_sql, [id]);
    if ((booking_detail.rowCount ?? 0) > 0) {
      throw new AppError("Cannot delete guest with existing bookings",400);
    }
    const result = await pool.query<Guests>(sql, [id]);
    if (result.rowCount === 0) {
      throw new AppError("Deletion problem!",500);
    }
    return res.status(200).json({ success: true, message: "Guest deleted successfully!", data: result.rows[0] });
  } catch (error) {
    next(error)
  }
};
