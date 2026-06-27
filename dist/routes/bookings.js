"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const sql = "SELECT * FROM bookings;";
    try {
        const result = await db_1.default.query(sql);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No booking found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Booking fetched successfully", data: result.rows });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM bookings WHERE id = $1;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "No booking found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Booking fetched successfully", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
router.post("/", async (req, res) => {
    const { guest_id, room_id, check_in, check_out, status } = req.body;
    const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,total_price,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *;";
    const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
    const update_room_sql = "UPDATE rooms SET is_available= $1 WHERE id =$2;";
    try {
        await db_1.default.query("BEGIN");
        const room_detail = await db_1.default.query(check_room_sql, [room_id]);
        if (room_detail.rowCount === 0) {
            await db_1.default.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        const room_available = room_detail.rows[0].is_available;
        if (!room_available) {
            await db_1.default.query("ROLLBACK");
            return res.status(400).json({ success: false, message: "Room is not available!", data: null });
        }
        const check_in_date = new Date(check_in);
        const check_out_date = new Date(check_out);
        const oneDay = 1000 * 60 * 60 * 24;
        if (check_in_date >= check_out_date) {
            await db_1.default.query("ROLLBACK");
            return res.status(400).json({ success: false, message: "Check-in date must be before check-out date!", data: null });
        }
        const diffInTime = check_out_date.getTime() - check_in_date.getTime();
        const total_day = Math.round(diffInTime / oneDay);
        const roomPrice = room_detail.rows[0].price;
        const total_price = roomPrice * total_day;
        const result = await db_1.default.query(sql, [guest_id, room_id, check_in, check_out, total_price, status]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Insertion problem!", data: null });
        }
        else {
            await db_1.default.query(update_room_sql, [false, room_id]);
            await db_1.default.query("COMMIT");
            return res.status(201).json({ success: true, message: "Room booked successfully!", data: result.rows[0] });
        }
    }
    catch (error) {
        await db_1.default.query('ROLLBACK');
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
router.put("/:id/cancel", async (req, res) => {
    const id = Number(req.params.id);
    const booking_detail_sql = "SELECT * FROM bookings WHERE id=$1;";
    const sql = "UPDATE bookings SET status = $1 WHERE id=$2 RETURNING *;";
    const update_room_available_sql = "UPDATE rooms SET is_available =$1 WHERE id=$2 ;";
    try {
        const booking_detail = await db_1.default.query(booking_detail_sql, [id]);
        if (booking_detail.rows[0].status === "cancelled") {
            return res.status(400).json({ success: false, message: "Already cancelled room!", data: null });
        }
        const result = await db_1.default.query(sql, ["cancelled", id]);
        const room_id = result.rows[0].room_id;
        if (result.rowCount === 0) {
            return res.status(400).json({ success: false, message: "Updation problem!", data: null });
        }
        await db_1.default.query(update_room_available_sql, [true, room_id]);
        return res.status(200).json({ success: true, message: "Booking cancelled!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
router.get("/guest/:guestId", async (req, res) => {
    const guestId = Number(req.params.guestId);
    const sql = "SELECT * FROM bookings WHERE guest_id=$1;";
    try {
        const result = await db_1.default.query(sql, [guestId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "No guest found with booking!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guest found with booking!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
exports.default = router;
