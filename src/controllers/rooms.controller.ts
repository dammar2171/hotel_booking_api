import pool from "../config/db";
import { NextFunction, Request,Response } from "express";
import { ApiResponse, CreateRoomsBody, PaginatedResponse, PaginationQuery, Rooms } from "../types/types";
import { buildPaginationMeta, getPagination } from "../utils/pagination";
import { AppError } from "../utils/AppError";

export const getRooms = async (
  req: Request<{}, {}, {}, PaginationQuery & { type?: string }>,
  res: Response<PaginatedResponse<Rooms>>,next:NextFunction
) => {
  const { currentPage, pageLimit, offset } = getPagination(req.query.page, req.query.limit);
  const type = req.query.type;

  try {
    let countSql = "SELECT COUNT(*) as total FROM rooms";
    let dataSql  = "SELECT * FROM rooms";
    const params: any[] = [];

    if (type) {
      countSql += " WHERE type ILIKE $1";
      dataSql  += " WHERE type ILIKE $1";
      params.push(type);
    }

    dataSql += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const totalCount = await pool.query(countSql, type ? [type] : []);
    const totalItems = Number(totalCount.rows[0].total);

    const result = await pool.query<Rooms>(dataSql, [...params, pageLimit, offset]);

    return res.status(200).json({
      success: true,
      message: result.rows.length === 0 ? "No rooms found" : "Rooms fetched successfully!",
      data: result.rows,
      pagination: buildPaginationMeta(currentPage, pageLimit, totalItems),
    });
  } catch (error) {
    next(error)
  }
};

export const getAvailableRooms=async(req:Request,res:Response<ApiResponse<Rooms[] | null>>,next:NextFunction)=>{
  const sql = "SELECT * FROM rooms WHERE is_available = true;";
  try {
    const result = await pool.query<Rooms>(sql);
    if(result.rows.length === 0 ){
      throw new AppError("No rooms available!",404);
    }
    return res.status(200).json({success:true,message:"Rooms available fetched!",data:result.rows});
  } catch (error) {
    next(error)
  }
}

export const getRoomById = async(req:Request<{id:string}>,res:Response<ApiResponse<Rooms | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const sql = "SELECT * FROM rooms WHERE id = $1;";
  try {
    const result = await pool.query<Rooms>(sql,[id]);
    if(result.rowCount === 0){
      throw new AppError("Room not found!",404);
    }
    return res.status(200).json({success:true,message:"Room found!",data:result.rows[0]});
  } catch (error) {
    next(error)
  }
}

export const createRoom=async(req:Request<{},{},CreateRoomsBody>,res:Response<ApiResponse<Rooms | null>>,next:NextFunction)=>{
  const {room_number,type,price,is_available,description,
      image_url, rating, amenities} = req.body;
  const sql = "INSERT INTO rooms(room_number,type,price,is_available,description,image_url, rating, amenities)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;";
  try {
    const result = await pool.query<Rooms>(sql,[room_number,type,price,is_available,description ?? null,
       image_url   ?? null,
       rating      ?? null,
       amenities   ?? null]);
    return res.status(201).json({success:true,message:"Room created sucessfully!",data:result.rows[0]});
  } catch (error) {
    next(error)
  }
}

export const updateRoom =  async(req:Request<{id:string}>,res:Response<ApiResponse<Rooms | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const {room_number, type, price,
      is_available, description,
      image_url, rating, amenities} = req.body;
  try {
    const result = await pool.query<Rooms>(
      `UPDATE rooms SET
        room_number  = COALESCE($1, room_number),
        type         = COALESCE($2, type),
        price        = COALESCE($3, price),
        is_available = COALESCE($4, is_available),
        description  = COALESCE($5, description),
        image_url    = COALESCE($6, image_url),
        rating       = COALESCE($7, rating),
        amenities    = COALESCE($8, amenities)
       WHERE id = $9
       RETURNING *;`,
      [room_number, type, price, is_available,
       description, image_url, rating, amenities, id]
    );
    if(result.rowCount === 0){
      throw new AppError("Room not found!",404);
    }
    return res.status(200).json({success:true,message:"Room updated successfully!",data:result.rows[0]})
  } catch (error) {
    next(error)
  }
}

export const deleteRoom = async(req:Request<{id:string}>,res:Response<ApiResponse<Rooms | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const sql = "DELETE FROM rooms WHERE id = $1 RETURNING *;";
  try {
    const result = await pool.query<Rooms>(sql,[id]);
    if(result.rowCount === 0){
      throw new AppError("Room not found!",404);
    }
    return res.status(200).json({success:true,message:"Room deleted successfully!",data:result.rows[0]})
  } catch (error) {
    next(error)
  }
}