import {z} from "zod";

export const createRoomSchema = z.object({
  room_number: z.number().min(1,"Room number is required!"),
  type:z.string().min(1,"Room type is required"),
  price:z.number().positive("Price must be positive in number"),
  is_available:z.boolean().optional().default(true)
})

export const updateRoomSchema = z.object({
  room_number:z.string().min(1).optional(),
  type:z.string().min(1).optional(),
  price:z.number().positive().optional(),
  is_available:z.boolean().optional()
})