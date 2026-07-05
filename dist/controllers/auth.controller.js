"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const AppError_1 = require("../utils/AppError");
const SALT_ROUNDS = 10;
const registerUser = async (req, res, next) => {
    const { name, email, password, confirmPsd } = req.body;
    if (password !== confirmPsd) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password do not matched! Try again.",
            data: null
        });
    }
    const insert_sql = "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email,role,created_at;";
    try {
        const existing_email = await db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing_email.rowCount && existing_email.rowCount > 0) {
            throw new AppError_1.AppError("Email already registered!", 400);
        }
        const hashed_Password = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const result = await db_1.default.query(insert_sql, [name, email, hashed_Password]);
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: result.rows[0]
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const result = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
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
        return res.status(200).json({
            success: true,
            message: "Login successfully!",
            data: { token }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
