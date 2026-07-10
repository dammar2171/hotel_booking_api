"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const SALT_ROUNDS = 10;
const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const existing = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing.rowCount && existing.rowCount > 0) {
            await client.query("ROLLBACK");
            throw new AppError_1.AppError("Email already registered!", 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userResult = await client.query(`INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`, [name, email, hashedPassword]);
        const newUser = userResult.rows[0];
        await client.query(`INSERT INTO guests (name, email, phone, user_id)
       VALUES ($1, $2, $3, $4)`, [name, email, "", newUser.id]);
        await client.query("COMMIT");
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: newUser,
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        next(error);
    }
    finally {
        client.release();
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("User not found!", 404);
        }
        const user = result.rows[0];
        const compare_password = await bcrypt_1.default.compare(password, user.password);
        if (!compare_password) {
            throw new AppError_1.AppError("Invalid email or password!", 401);
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const signOptions = {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, signOptions);
        const returnUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        return res.status(200).json({
            success: true,
            message: "Login successfully!",
            data: { token, user: returnUser }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const updateUserPassword = async (req, res, next) => {
    const id = Number(req.params.id);
    console.log(req.body);
    const { currentPassword, newPassword } = req.body;
    const getUserSql = "SELECT * FROM users WHERE id=$1";
    const updateSql = "UPDATE users SET password=$1 WHERE id=$2 RETURNING id, name, email, role, created_at";
    try {
        const result = await db_1.default.query(getUserSql, [id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("User not found!", 404);
        }
        const user = result.rows[0];
        const verifyPassword = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!verifyPassword) {
            throw new AppError_1.AppError("Current password do not matched. Try again!", 401);
        }
        const hashPassword = await bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
        const UpdateResult = await db_1.default.query(updateSql, [hashPassword, id]);
        return res.status(200).json({
            success: true,
            message: "Password changed!",
            data: UpdateResult.rows[0],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserPassword = updateUserPassword;
