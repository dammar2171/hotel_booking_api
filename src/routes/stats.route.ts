import { Router } from "express";
import { getStats } from "../controllers/stats.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.get("/",authenticate,authorizeAdmin,getStats);

export default router;