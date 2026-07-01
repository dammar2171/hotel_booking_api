import { Router } from "express";
import { getStats } from "../controllers/stats.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get all stats
 *     description: Returns list of stats.
 *     tags: [Stats]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/",authenticate,authorizeAdmin,getStats);

export default router;