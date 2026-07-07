import { Router } from "express";
import { loginUser, registerUser,updateUserPassword } from "../controllers/auth.controller";
import { registerUserSchema,loginUserSchema, UpdateUserSchema } from "../schemas/auth.schema";
import { validate } from "../middleware/validate";

const router = Router();
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
router.post("/register", validate(registerUserSchema),registerUser);

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
router.post("/login", validate(loginUserSchema),loginUser);


/**
 * @swagger
 * /auth/{id}/password:
 *   post:
 *     summary: Update user
 *     description: Update a user and returns a updated data.
 *     tags: [Authentication]
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
 *               data:{
 *                      id,name,email,role,created_at
 *                    }
 *       404:
 *         description: User not found!
 *       401:
 *         description:Current password do not matched. Try again!
 *       500:
 *         description: Internal server error
 */
router.put("/:id/password", validate(UpdateUserSchema),updateUserPassword);

export default router;