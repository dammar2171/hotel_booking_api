import { Request,Response,Router } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import pool from '../db'
import { User,RegisterBody,LoginBody,JwtPayload,ApiResponse } from '../types';

const router = Router();
const SALT_ROUNDS = 10;

router.post("/register", async(req:Request<{},{},RegisterBody>,res:Response<ApiResponse<Omit<User[],"password"> | null>>)=>{
  const {name,email,password}=req.body;
  if(!name || !email || !password){
    return res.status(400).json({success:false,message:"All fields are required!",data:null});
  }
  const insert_sql = "INSERT INTO users(name,email,password,role)VALUES($1,$2,$3,$4) RETURNING *;";
  try {
    const existing_email = await pool.query<User>("SELECT * FROM users WHERE email = $1",[email]);
    if(existing_email.rowCount && existing_email.rowCount > 0){
      return res.status(400).json({
        success:false,
        message:"Email already registered!",
        data:null
      })
    }
    const hashed_Password = await bcrypt.hash(password,SALT_ROUNDS);
    const result = await pool.query<User>(insert_sql,[name,email,hashed_Password]);
    if(result.rowCount === 0){
      return res.status(500).json({
        success:false,
        message:"Insertion problem!",
        data:null
      })
    }
    return res.status(201).json({
      success:true,
      message:"User regestered successfully!",
      data:result.rows
    })
  } catch (error) {
    console.log("DATABASE_ERROR: ",error)
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
      data:null
    })
  }
})


