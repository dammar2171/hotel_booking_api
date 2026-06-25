import dotenv from 'dotenv'
import { error } from 'node:console';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host:process.env.DB_HOST,
  port:Number(process.env.DB_PORT),
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME
})

pool.on("connect",()=>{
  console.log("Database connected successfully!");
})

pool.on("error",(error:Error)=>{
  console.log("DATABASE_CONNECTION_ERROR: ",error);
})

export default pool;