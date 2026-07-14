import {z} from "zod";

export const createGuestSchema = z.object({
  name:z.string().min(2,"Minimum two alphabet required!"),
  email:z.string().email("invalid email format"),
  phone:z.string().min(10,"Phone number must be atleast 10 digits").max(15, "Phone number must be at most 15 digit")
})

export const updateGuestSchema = z.object({
   name:z.string().min(2).optional(),
   email:z.string().email().optional(),
   phone:z.string().min(10).max(15).optional()
})