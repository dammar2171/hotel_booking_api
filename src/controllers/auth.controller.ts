import { NextFunction, Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../config/db'
import { User,RegisterBody,LoginBody,JwtPayload,ApiResponse, LoginResponse, updateUserBody } from '../types/types';
import { AppError } from '../utils/AppError';

const SALT_ROUNDS = 10;

export const registerUser = async (req:Request<{},{},RegisterBody>, res:Response<ApiResponse<User>>, next:NextFunction) => {
  const { name, email, password } = req.body;
  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      await client.query("ROLLBACK");
      throw new AppError("Email already registered!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );
    const newUser = userResult.rows[0];

    await client.query(
      `INSERT INTO guests (name, email, phone, user_id)
       VALUES ($1, $2, $3, $4)`,
      [name, email, "", newUser.id]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data:    newUser,
    });

  } catch (error) {
    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const loginUser=async(req:Request<{},{},LoginBody>,res:Response<ApiResponse<LoginResponse | null>>,next:NextFunction)=>{
  const {email,password}=req.body;
  try {
    const result = await pool.query<User>("SELECT * FROM users WHERE email=$1",[email]);
    if(result.rowCount === 0){
      throw new AppError("User not found!",404);
    }
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

    const returnUser={
      id:user.id,
      name:user.name,
      email:user.email,
      role:user.role,
    }
    return res.status(200).json({
      success:true,
      message:"Login successfully!",
      data:{token, user:returnUser}
    })

  } catch (error) {
    next(error);
  }
}

export const updateUserPassword = async(req:Request<{id:string},{},updateUserBody>,res:Response<ApiResponse<Omit<User,"password"> | null>>,next:NextFunction)=>{
  const id = Number(req.params.id);
  console.log(req.body);
  const {currentPassword,newPassword} = req.body;
  const getUserSql = "SELECT * FROM users WHERE id=$1";
  const updateSql = "UPDATE users SET password=$1 WHERE id=$2 RETURNING id, name, email, role, created_at";
  try {
    const result = await pool.query<User>(getUserSql,[id]);
    if(result.rowCount === 0){
      throw new AppError("User not found!",404);
    }
    const user = result.rows[0];
    const verifyPassword = await bcrypt.compare(currentPassword,user.password);
    if(!verifyPassword){
      throw new AppError("Current password do not matched. Try again!",401);
    }
    const hashPassword = await bcrypt.hash(newPassword,SALT_ROUNDS);
    const UpdateResult = await pool.query<User>(updateSql,[hashPassword,id]);
    return res.status(200).json({
      success:true,
      message:"Password changed!",
      data:UpdateResult.rows[0],
    })
  } catch (error) {
    next(error)
  }
}