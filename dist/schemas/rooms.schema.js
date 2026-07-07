"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    room_number: zod_1.z.string().min(1, "Room number is required"),
    type: zod_1.z.string().min(1, "Room type is required"),
    price: zod_1.z.number().positive("Price must be positive"),
    is_available: zod_1.z.boolean().optional().default(true),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters").optional(),
    image_url: zod_1.z.string().url("Must be a valid URL").optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateRoomSchema = zod_1.z.object({
    room_number: zod_1.z.string().min(1).optional(),
    type: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().positive().optional(),
    is_available: zod_1.z.boolean().optional(),
    description: zod_1.z.string().min(10).optional(),
    image_url: zod_1.z.string().url().optional(),
    rating: zod_1.z.number().min(0).max(5).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
});
