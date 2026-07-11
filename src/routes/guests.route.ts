import { Router } from "express";
import { getGuests, getGuestById, createGuest, deleteGuest ,updateGuest, getGuestByUserId} from "../controllers/guests.controller";
import { validate } from "../middleware/validate";
import { createGuestSchema ,updateGuestSchema} from "../schemas/guests.schema";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /guests:
 *   get:
 *     summary: Get all guests
 *     description: Returns a paginated list of guests.
 *     tags: [Guests]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/",authenticate,authorizeAdmin, getGuests);

/**
 * @swagger
 * /guests/{id}:
 *   get:
 *     summary: Get guest by ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest found successfully
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id",authenticate, authorizeAdmin, getGuestById);

/**
 * @swagger
 * /guests/user/{userId}:
 *   get:
 *     summary: Get guest by user ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest found 
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", authenticate, authorizeAdmin,getGuestByUserId);

/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Create a new guest
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGuestBody'
 *     responses:
 *       201:
 *         description: Guest created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/",authenticate, validate(createGuestSchema),createGuest);

/**
 * @swagger
 * /guests/{id}:
 *   put:
 *     summary: Update guest
 *     tags: [Guests]
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
 *         description: Guest updated successfully
 *       404:
 *         description: Guest not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id",authenticate, validate(updateGuestSchema),updateGuest);

/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Delete guest
 *     tags: [Guests]
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
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id",authenticate,authorizeAdmin, deleteGuest);

export default router;
