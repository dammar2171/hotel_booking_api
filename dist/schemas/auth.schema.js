"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be in at least two character!"),
    email: zod_1.z.email("Email invalid format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 character"),
    confirmPsd: zod_1.z.string().min(6, "Password must be at least 6 character")
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.email("Email invalid format!"),
    password: zod_1.z.string().min(1, "Password is required!")
});
exports.UpdateUserSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Password is required!"),
    newPassword: zod_1.z.string().min(1, "Password is required!"),
});
