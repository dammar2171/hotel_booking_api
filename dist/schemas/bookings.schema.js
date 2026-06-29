"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z
    .object({
    guest_id: zod_1.z.number().int().positive("Guest ID must be a positive integer"),
    room_id: zod_1.z.number().int().positive("Room ID must be a positive integer"),
    check_in: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "check_in must be a valid date",
    }),
    check_out: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "check_out must be a valid date",
    }),
    status: zod_1.z.enum(["confirmed", "pending", "cancelled"]),
})
    .refine((data) => new Date(data.check_out) > new Date(data.check_in), {
    message: "check_out must be after check_in",
    path: ["check_out"],
});
