"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
const SALT_ROUNDS = 10;
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!", data: null });
    }
    const insert_sql = "INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING id,name,email,role,created_at;";
    try {
        const existing_email = await db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existing_email.rowCount && existing_email.rowCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered!",
                data: null
            });
        }
        const hashed_Password = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const result = await db_1.default.query(insert_sql, [name, email, hashed_Password]);
        if (result.rowCount === 0) {
            return res.status(500).json({
                success: false,
                message: "Insertion problem!",
                data: null
            });
        }
        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: result.rows[0]
        });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            data: null
        });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All field required!",
            data: null
        });
    }
    try {
        const result = await db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!",
                data: null
            });
        }
        const user = result.rows[0];
        const compare_password = await bcrypt_1.default.compare(password, user.password);
        if (!compare_password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!2",
                data: null
            });
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
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            data: null
        });
    }
});
exports.default = router;
