import { Request,Response ,NextFunction } from "express";
import pool from "../config/db";
import { ApiResponse, Contact, ContactBody, PaginatedResponse, PaginationQuery } from "../types/types";
import { AppError } from "../utils/AppError";
import { buildPaginationMeta, getPagination } from "../utils/pagination";
export const createContact = async(req:Request<{},{},ContactBody>,res:Response<ApiResponse<Contact | null>>,next:NextFunction)=>{
  const {name,email,phone,subject,message} = req.body;
  const sql = 'INSERT INTO contacts(name,email,phone,subject,message)VALUES($1,$2,$3,$4,$5) RETURNING *;';
  try {
    const result = await pool.query<Contact>(sql,[name,email,phone,subject,message]);
    return res.status(201).json({
      success:true,
      message:"Message sent successfully!",
      data:result.rows[0]
    })
  } catch (error) {
    next(error);
  }
}

export const deleteContact = async(req:Request<{id:string}>,res:Response<ApiResponse<Contact | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  const sql = 'DELETE FROM contacts WHERE id=$1 RETURNING *;';
  try {
    const result = await pool.query(sql,[id]);
    if(result.rowCount === 0){
      throw new AppError("Contact not found!",404);
    }
    return res.status(200).json({
      success:true,
      message:"Message deleted successfully!",
      data:result.rows[0]
    })
  } catch (error) {
    next(error);
  }
}

export const getContacts = async(req:Request<{},{},{},PaginationQuery>,res:Response<PaginatedResponse<Contact | null>>,next:NextFunction)=>{
  const {currentPage,pageLimit,offset} = getPagination(req.query.page,req.query.limit);
  const totalContacts = await pool.query('SELECT COUNT(*) AS total FROM contacts ')
  const totalItem = Number(totalContacts.rows[0].total);
  const sql = 'SELECT * FROM contacts ORDER BY id LIMIT $1 OFFSET $2;';
  try {
    const result = await pool.query<Contact>(sql,[pageLimit,offset]);
    if(result.rows.length === 0){
      throw new AppError("No message founds!",404);
    }
    return res.status(200).json({
      success:true,
      message:"Messages found!",
      data:result.rows,
      pagination:buildPaginationMeta(currentPage,pageLimit,totalItem),
    })
  } catch (error) {
    next(error)
  }
}