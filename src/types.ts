export interface Rooms{
  id:number;
  room_number:string;
  type:string;
  price:number;
  is_available:boolean;
}

export interface CreateRoomsBody{
  room_number:string;
  type:string;
  price:number;
  is_available:boolean;
}

export interface Guests{
  id:number;
  name:string;
  email:string;
  phone:string;
}

type BookingStatus = "confirmed" | "cancelled" | "pending";
export interface Booking{
  id:number;
  guest_id:number;
  room_id:number;
  check_in:string;
  check_out:string;
  price:number;
  status:BookingStatus
}

export interface ApiResponse<T>{
  success:boolean;
  message:string;
  data:T;
}