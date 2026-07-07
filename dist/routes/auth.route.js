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
/**
 * @swagger
 * /{id}/password:
 *   put:
 *     summary: Update user password
 *     description: Update a user's password and return updated data.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPasswordBody'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Password changed!
 *               data:
 *                 id: 1
 *                 name: John Doe
 *                 email: john@gmail.com
 *                 role: user
 *                 created_at: 2026-07-07T10:00:00Z
 *       404:
 *         description: User not found!
 *       401:
 *         description: Current password does not match. Try again!
 *       500:
 *         description: Internal server error
 */
router.put("/:id/password", (0, validate_1.validate)(auth_schema_1.UpdateUserSchema), auth_controller_1.updateUserPassword);
exports.default = router;
