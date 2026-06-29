import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload ,ApiResponse, User} from "../types/types";

declare global{
  namespace Express{
    interface Request{
      user?:JwtPayload,
    }
  }
}

export const authenticate=(req:Request,res:Response,next:NextFunction):void =>{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')){
    res.status(401).json({
      success:false,
      message:"Access denied. No token provided!",
      data:null
    })
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded
    next();
  } catch (error) {
    res.status(401).json({
      success:false,
      message:"Expired or invalid token",
      data:null
    })
  }
}

export const authorizeAdmin = (req:Request,res:Response,next:NextFunction):void=>{
  if(req.user?.role !== "admin"){
    res.status(403).json({
      success:false,
      message:"Access denied. Admin only!",
      data:null
    })
    return;
  }
  next();
}