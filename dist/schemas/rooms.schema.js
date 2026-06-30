"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomSchema = exports.createRoomSchema = void 0;
const zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    room_number: zod_1.z.string().min(1, "Room number is required!"),
    type: zod_1.z.string().min(1, "Room type is required"),
    price: zod_1.z.number().positive("Price must be positive in number"),
    is_available: zod_1.z.boolean().optional().default(true)
});
exports.updateRoomSchema = zod_1.z.object({
    room_number: zod_1.z.string().min(1).optional(),
    type: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().positive().optional(),
    is_available: zod_1.z.boolean().optional()
});
