import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createBooking, getBookingByGuestId, getBookingById, getBookings, cancelBooking} from "../controllers/bookings.controller";
import { validate } from "../middleware/validate";
import { createBookingSchema } from "../schemas/bookings.schema";

const router = Router();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Returns a paginated list of bokings.
 *     tags: [Bookings]
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
 *         description: Bookings fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/",authenticate,getBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get bookings by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking fetched successfully
 *       404:
 *         description: No booking found
 *       500:
 *         description: Internal server error
 */
router.get("/:id",authenticate,getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingBody'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       404:
 *         description: Room not found
 *       400:
 *          description: Room is not available
 *       500:
 *         description: Internal server error
 */
router.post("/",authenticate,validate(createBookingSchema),createBooking);

/**
 * @swagger
 * /bookings:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingody'
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description:Already cancelled room
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id/cancel",authenticate,cancelBooking);

/**
 * @swagger
 * /guest/{guestId}:
 *   get:
 *     summary: Get booking by guest  ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Guest found with booking!
 *       404:
 *         description: No guest found with booking
 *       500:
 *         description: Internal server error
 */
router.get("/guest/:guestId",authenticate,getBookingByGuestId);

export default router;