import { Router }                        from "express";
import { authenticate, authorizeAdmin }  from "../middleware/auth";
import { validate }                      from "../middleware/validate";
import { createRoomSchema, updateRoomSchema } from "../schemas/rooms.schema";
import {
  getRooms, getAvailableRooms,
  getRoomById, createRoom,
  updateRoom,  deleteRoom,
} from "../controllers/rooms.controller";

const router = Router();

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
router.get("/", getRooms);

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
router.get("/available", getAvailableRooms);

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
router.get("/:id", getRoomById);

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
 *       500:
 *         description: Internal server error
 */
router.post("/",    authenticate, authorizeAdmin, validate(createRoomSchema), createRoom);

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
router.put("/:id",  authenticate, authorizeAdmin, validate(updateRoomSchema), updateRoom);

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
router.delete("/:id", authenticate, authorizeAdmin, deleteRoom);

export default router;