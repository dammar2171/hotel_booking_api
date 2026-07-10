export interface Rooms{
  id:number;
  room_number:string;
  type:string;
  price:number;
  is_available:boolean;
  description:  string | null;
  image_url:    string | null;
  rating:       number | null;
  amenities:    string[] | null;
}

export interface CreateRoomsBody{
  room_number:string;
  type:string;
  price:number;
  is_available:boolean;
  description?:  string | null;
  image_url?:    string | null;
  rating?:       number | null;
  amenities?:    string[] | null;
}

export interface Guests{
  id:number;
  name:string;
  email:string;
  phone:string;
}

export interface CreateGuestBody{
  name:string;
  email:string;
  phone:string;
}

export type BookingStatus = "confirmed" | "cancelled" | "pending";
export interface Booking{
  id:number;
  guest_id:number;
  room_id:number;
  check_in:string;
  check_out:string;
  total_price:number;
  status:BookingStatus
  guests:number;
  paymentMethod:string;
  specialRequest:string | null;
}

export interface CreateBookingBody{
  guest_id:number;
  room_id:number;
  check_in:string;
  check_out:string;
  price:number;
  status:BookingStatus
  guests:number;
  paymentMethod:string;
  specialRequest:string | null;
}
export interface ApiResponse<T>{
  success:boolean;
  message:string;
  data:T;
}
export type UserRole = "user" | "admin";
export interface User{
  id:number;
  name:string;
  email:string;
  password:string;
  role:UserRole;
  crested_at:string;
}

export interface RegisterBody{
  name:string;
  email:string;
  password:string;
  confirmPsd:string;
}

export interface LoginBody{
  email:string;
  password:string;
}

export interface updateUserBody{
  currentPassword:string;
  newPassword:string;
}

export interface JwtPayload{
  userId:number;
  email:string;
  role:UserRole;
}

export interface PaginationQuery{
  page:string,
  limit:string
}

export interface PaginatedResponse<T>{
  success:boolean;
  message:string;
  data:T[];
  pagination:{
    currentPage:number;
    totalPage:number;
    totalItem:number;
    limit:number;
  }
}

export interface Stats{
  totalRooms:number;
  availableRooms:number;
  occupiedRooms:number;
  totalGuests:number;
  totalBookings:number
  confirmedBookings:number;
  cancelledBookings:number;
  totalRevenue:number;
  occupancyRate:number;
  topBookingRoom:string;
}

export interface LoginResponse{
  token:string,
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface Contact{
  id:number;
  name:string;
  email:string;
  phone:string;
  subject:string;
  message:string;
}
export interface ContactBody{
  name:string;
  email:string;
  phone:string;
  subject:string;
  message:string;
}