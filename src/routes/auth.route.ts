import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { registerUserSchema,loginUserSchema } from "../schemas/auth.schema";
import { validate } from "../middleware/validate";

const router = Router();

router.post("/register", validate(registerUserSchema),registerUser);
router.post("/login", validate(loginUserSchema),loginUser);

export default router;