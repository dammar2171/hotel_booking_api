"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const bookings_controller_1 = require("../controllers/bookings.controller");
const validate_1 = require("../middleware/validate");
const bookings_schema_1 = require("../schemas/bookings.schema");
const router = (0, express_1.Router)();
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
router.get("/", auth_1.authenticate, bookings_controller_1.getBookings);
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
router.get("/:id", auth_1.authenticate, bookings_controller_1.getBookingById);
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
router.post("/", auth_1.authenticate, (0, validate_1.validate)(bookings_schema_1.createBookingSchema), bookings_controller_1.createBooking);
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
router.put("/:id/cancel", auth_1.authenticate, bookings_controller_1.cancelBooking);
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
router.get("/guest/:guestId", auth_1.authenticate, bookings_controller_1.getBookingByGuestId);
exports.default = router;
