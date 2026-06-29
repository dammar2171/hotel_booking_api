import dotenv from 'dotenv';
dotenv.config();

import express, {Request,Response} from 'express';
import roomsRoutes from './routes/rooms';
import guestsRoutes from './routes/guests';
import bookingsRoutes from './routes/bookings';
import authRoutes from './routes/auths'
import pool from './db'

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/",(req:Request,res:Response)=>{
  res.send("Server is running successfully!")
})

app.use("/auth",authRoutes);
app.use("/rooms",roomsRoutes);
app.use("/guests",guestsRoutes);
app.use("/bookings",bookingsRoutes);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`)
})