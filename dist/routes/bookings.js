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
    const { guest_id, room_id, check_in, check_out, price, status } = req.body;
    const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,price,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *;";
    const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
    try {
        const check_room = await db_1.default.query(check_room_sql, [room_id]);
        if (check_room.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        console.log(check_room.rows[0]);
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
});
exports.default = router;
