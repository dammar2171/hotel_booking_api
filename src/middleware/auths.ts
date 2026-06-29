import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload ,ApiResponse, User} from "../types";

declare global{
  namespace Express{
    interface Request{
      user?:JwtPayload,
    }
  }
}

export const authenticate=(req:Request,res:Response,next:NextFunction) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(401).json({
      success:false,
      message:"Access denied. No token provided!",
      data:null
    })
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded
    next();
  } catch (error) {
    return res.status(401).json({
      success:false,
      message:"Expired or invalid token",
      data:null
    })
  }
}

export const authorizeAdmin = (req:Request,res:Response,next:NextFunction)=>{
  if(req.user?.role !== "admin"){
    return res.status(401).json({
      success:false,
      message:"Access denied. Admin only!",
      data:null
    })
  }
  next();
}