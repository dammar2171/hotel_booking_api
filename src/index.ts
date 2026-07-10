import dotenv from 'dotenv';
dotenv.config();

import express, {Request,Response} from 'express';
import roomsRoutes from './routes/rooms.route';
import guestsRoutes from './routes/guests.route';
import bookingsRoutes from './routes/bookings.route';
import authRoutes from './routes/auth.route';
import statsRoute from './routes/stats.route';
import contactRoute from './routes/contacts.route';
import pool from './config/db';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from  'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin:process.env.CLIENT_URL || "http://localhost:5173",
  methods:["POST","GET","PUT","DELETE"],
  credentials:true
}))

const limiter = rateLimit({
  windowMs:15*60*100,
  max:100,
  message:{
    success:false,
    message:"Too many attempts. Try again after 15  minutes!",
    data:null
  }
})
app.use(limiter);
app.use(morgan("dev"));

app.use(express.json());

app.get("/health", (req:Request,res:Response)=>{
  res.status(200).json({
    success:true,
    message:"Server is healthy",
    data:{
      uptime:process.uptime(),
      timestamp: new Date().toISOString
    }
  })
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth",authRoutes);
app.use("/rooms",roomsRoutes);
app.use("/guests",guestsRoutes);
app.use("/bookings",bookingsRoutes);
app.use("/contacts",contactRoute);
app.use("/stats",statsRoute);

app.use(errorHandler);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`)
})