"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guests_controller_1 = require("../controllers/guests.controller");
const validate_1 = require("../middleware/validate");
const guests_schema_1 = require("../schemas/guests.schema");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.get("/", auth_1.authenticate, guests_controller_1.getGuests);
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
router.get("/:id", auth_1.authenticate, guests_controller_1.getGuestById);
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
router.get("/user/:userId", auth_1.authenticate, guests_controller_1.getGuestByUserId);
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
router.post("/", auth_1.authenticate, (0, validate_1.validate)(guests_schema_1.createGuestSchema), guests_controller_1.createGuest);
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
router.put("/:id", auth_1.authenticate, (0, validate_1.validate)(guests_schema_1.updateGuestSchema), guests_controller_1.updateGuest);
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
router.delete("/:id", auth_1.authenticate, guests_controller_1.deleteGuest);
exports.default = router;
