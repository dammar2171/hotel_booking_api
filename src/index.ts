import express, {Request,Response} from 'express';
import dotenv from 'dotenv';
import roomsRoutes from './routes/rooms';
import guestsRoutes from './routes/guests';
import bookingsRoutes from './routes/bookings';
import authRotes from './routes/auths',
const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/",(req:Request,res:Response)=>{
  res.send("Server is running successfully!")
})

app.use("/auth",authRotes);
app.use("/rooms",roomsRoutes);
app.use("/guests",guestsRoutes);
app.use("/bookings",bookingsRoutes);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`)
})