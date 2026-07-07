import { z } from "zod";

export const createRoomSchema = z.object({
  room_number:  z.string().min(1, "Room number is required"),
  type:         z.string().min(1, "Room type is required"),
  price:        z.number().positive("Price must be positive"),
  is_available: z.boolean().optional().default(true),
  description:  z.string().min(10, "Description must be at least 10 characters").optional(),
  image_url:    z.string().url("Must be a valid URL").optional(),
  rating:       z.number().min(0).max(5).optional(),
  amenities:    z.array(z.string()).optional(),
});

export const updateRoomSchema = z.object({
  room_number:  z.string().min(1).optional(),
  type:         z.string().min(1).optional(),
  price:        z.number().positive().optional(),
  is_available: z.boolean().optional(),
  description:  z.string().min(10).optional(),
  image_url:    z.string().url().optional(),
  rating:       z.number().min(0).max(5).optional(),
  amenities:    z.array(z.string()).optional(),
});