"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const rooms_schema_1 = require("../schemas/rooms.schema");
const rooms_controller_1 = require("../controllers/rooms.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms with pagination
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by room type
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 */
router.get("/", auth_1.authenticate, rooms_controller_1.getRooms);
/**
 * @swagger
 * /rooms/available:
 *   get:
 *     summary: Get all available rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Available rooms fetched
 *       404:
 *         description: No available rooms
 */
router.get("/available", auth_1.authenticate, rooms_controller_1.getAvailableRooms);
/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room found
 *       404:
 *         description: Room not found
 */
router.get("/:id", auth_1.authenticate, rooms_controller_1.getRoomById);
/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomBody'
 *     responses:
 *       201:
 *         description: Room created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins only
 */
router.post("/", auth_1.authenticate, auth_1.authorizeAdmin, (0, validate_1.validate)(rooms_schema_1.createRoomSchema), rooms_controller_1.createRoom);
/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/CreateRoomBody'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 */
router.put("/:id", auth_1.authenticate, auth_1.authorizeAdmin, (0, validate_1.validate)(rooms_schema_1.updateRoomSchema), rooms_controller_1.updateRoom);
/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
router.delete("/:id", auth_1.authenticate, auth_1.authorizeAdmin, rooms_controller_1.deleteRoom);
exports.default = router;
