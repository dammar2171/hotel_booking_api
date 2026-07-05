import { NextFunction, Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/db'
import { User,RegisterBody,LoginBody,JwtPayload,ApiResponse } from '../types/types';
import { AppError } from '../utils/AppError';


const SALT_ROUNDS = 10;

export const registerUser=async(req:Request<{},{},RegisterBody>,res:Response<ApiResponse<Omit<User,"password"> | null>>,next:NextFunction)=>{
  const {name,email,password,confirmPsd}=req.body;
  if(password !== confirmPsd){
    return res.status(400).json({
      success:false,
      message:"Password and confirm password do not matched! Try again.",
      data:null
    })
  }
  const insert_sql = "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email,role,created_at;";
  try {
    const existing_email = await pool.query<User>("SELECT * FROM users WHERE email = $1",[email]);
    if(existing_email.rowCount && existing_email.rowCount > 0){
      throw new AppError("Email already registered!",400);
    }
    const hashed_Password = await bcrypt.hash(password,SALT_ROUNDS);
    const result = await pool.query<User>(insert_sql,[name,email,hashed_Password]);
    return res.status(201).json({
      success:true,
      message:"User registered successfully!",
      data:result.rows[0]
    })
  } catch (error) {
    next(error);
  }
}

export const loginUser=async(req:Request<{},{},LoginBody>,res:Response<ApiResponse<{token:string} | null>>,next:NextFunction)=>{
  const {email,password}=req.body;
  try {
    const result = await pool.query<User>("SELECT * FROM users WHERE email=$1",[email]);
    const user = result.rows[0];
    const compare_password = await bcrypt.compare(password,user.password);

    if(!compare_password){
      throw new AppError("Invalid email or password!",401);
    }

    const payload:JwtPayload={
      userId: user.id,
      email:user.email,
      role:user.role,
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, signOptions);

    return res.status(200).json({
      success:true,
      message:"Login successfully!",
      data:{token}
    })

  } catch (error) {
    next(error);
  }
}