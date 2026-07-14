"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuestSchema = exports.createGuestSchema = void 0;
const zod_1 = require("zod");
exports.createGuestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Minimum two alphabet required!"),
    email: zod_1.z.string().email("invalid email format"),
    phone: zod_1.z.string().min(10, "Phone number must be atleast 10 digits").max(15, "Phone number must be at most 15 digit")
});
exports.updateGuestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(10).max(15).optional()
});
