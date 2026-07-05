"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_schema_1 = require("../schemas/auth.schema");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Password and confirm password do not  matched! Try again.
 *       400:
 *         description:Email already existed
 *       500:
 *         description: Internal server error
 */
router.post("/register", (0, validate_1.validate)(auth_schema_1.registerUserSchema), auth_controller_1.registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login successfully!
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", (0, validate_1.validate)(auth_schema_1.loginUserSchema), auth_controller_1.loginUser);
exports.default = router;
