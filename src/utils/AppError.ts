export class AppError extends Error{
  statusCode :number;
  isOperational:boolean;
  constructor(message:string,statusCode:number){
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // maintains proper stack in nodejs
    Error.captureStackTrace(this,this.constructor);
  }
}