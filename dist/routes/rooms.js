"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const express_1 = require("express");
const auths_1 = require("../middleware/auths");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const sql = "SELECT * FROM rooms;";
    try {
        const result = await db_1.default.query(sql);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No rooms found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Rooms found!", data: result.rows });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.get("/available", async (req, res) => {
    const sql = "SELECT * FROM rooms WHERE is_available = true;";
    try {
        const result = await db_1.default.query(sql);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No rooms available!", data: null });
        }
        return res.status(200).json({ success: true, message: "Rooms available fetched!", data: result.rows });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM rooms WHERE id = $1;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Room found!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.post("/", auths_1.authenticate, auths_1.authorizeAdmin, async (req, res) => {
    const { room_number, type, price, is_available } = req.body;
    const sql = "INSERT INTO rooms(room_number,type,price,is_available)VALUES($1,$2,$3,$4) RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [room_number, type, price, is_available]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Insertion Problem!", data: null });
        }
        return res.status(201).json({ success: true, message: "Room created sucessfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.put("/:id", auths_1.authenticate, auths_1.authorizeAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { room_number, type, price, is_available } = req.body;
    const sql = "UPDATE rooms SET room_number = COALESCE($1,room_number),type=COALESCE($2,type), price=COALESCE($3,price),is_available=COALESCE($4,is_available) WHERE id = $5 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [room_number, type, price, is_available, id]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Updation Problem!", data: null });
        }
        return res.status(200).json({ success: true, message: "Room updated successfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.delete("/:id", auths_1.authenticate, auths_1.authorizeAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM rooms WHERE id = $1 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(501).json({ success: false, message: "Deletion Problem!", data: null });
        }
        return res.status(200).json({ success: true, message: "Room deleted successfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
exports.default = router;
