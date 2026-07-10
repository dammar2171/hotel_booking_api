import { z } from "zod";

export const createBookingSchema = z
  .object({
    guest_id: z.number().int().positive("Guest ID must be a positive integer"),
    room_id: z.number().int().positive("Room ID must be a positive integer"),
    check_in: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "check_in must be a valid date",
      }),

    check_out: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "check_out must be a valid date",
      }),
      guests:          z.number().int().min(1).optional(),
      payment_method:  z.enum(["hotel", "online", "card"]).optional(),
      special_request: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.check_out) > new Date(data.check_in),
    {
      message: "check_out must be after check_in",
      path: ["check_out"],
    }
  );