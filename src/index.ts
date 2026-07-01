import dotenv from 'dotenv';
dotenv.config();

import express, {Request,Response} from 'express';
import roomsRoutes from './routes/rooms.route';
import guestsRoutes from './routes/guests.route';
import bookingsRoutes from './routes/bookings.route';
import authRoutes from './routes/auth.route';
import statsRoute from './routes/stats.route';
import pool from './db';
import { errorHandler } from './middleware/errorHandler';

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
app.use("/stats",statsRoute);

app.use(errorHandler);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`)
})