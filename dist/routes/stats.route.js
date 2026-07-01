"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.get("/", auth_1.authenticate, auth_1.authorizeAdmin, stats_controller_1.getStats);
exports.default = router;
