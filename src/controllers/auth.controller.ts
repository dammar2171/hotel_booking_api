import { Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../db'
import { User,RegisterBody,LoginBody,JwtPayload,ApiResponse } from '../types/types';


const SALT_ROUNDS = 10;

export const registerUser=async(req:Request<{},{},RegisterBody>,res:Response<ApiResponse<Omit<User,"password"> | null>>)=>{
  const {name,email,password}=req.body;
  // if(!name || !email || !password){
  //   return res.status(400).json({success:false,message:"All fields are required!",data:null});
  // }
  const insert_sql = "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email,role,created_at;";
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
      message:"User registered successfully!",
      data:result.rows[0]
    })
  } catch (error) {
    console.log("DATABASE_ERROR: ",error)
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
      data:null
    })
  }
}

export const loginUser=async(req:Request<{},{},LoginBody>,res:Response<ApiResponse<{token:string} | null>>)=>{
  const {email,password}=req.body;
  // if(!email || !password){
  //   return res.status(400).json({
  //     success:false,
  //     message:"All field required!",
  //     data:null
  //   });
  // }
  try {
    const result = await pool.query<User>("SELECT * FROM users WHERE email=$1",[email]);
    if(result.rowCount === 0){
      return res.status(401).json({
        success:false,
        message:"Invalid email or password!",
        data:null
      });
    }
    const user = result.rows[0];
    const compare_password = await bcrypt.compare(password,user.password);

    if(!compare_password){
      return res.status(401).json({
        success:false,
        message:"Invalid email or password!2",
        data:null
      })
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
    console.log("DATABASE_ERROR: ",error)
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
      data:null
    })
  }
}