"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const sql = "SELECT * FROM guests;";
    try {
        const result = await db_1.default.query(sql);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Guest not found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guests fetched sucessfully!", data: result.rows });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM guests WHERE id =$1;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Guest not found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guests found sucessfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.post("/", async (req, res) => {
    const { name, email, phone } = req.body;
    const sql = "INSERT INTO guests(name,email,phone) VALUES($1,$2,$3) RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [name, email, phone]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Insertion problem!", data: null });
        }
        return res.status(201).json({ success: true, message: "Guests inserted sucessfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.put("/:id", async (req, res) => {
    const { name, email, phone } = req.body;
    const id = Number(req.params.id);
    const sql = "UPDATE guests SET name=COALESCE($1,name),email=COALESCE($2,email),phone=COALESCE($3,phone) WHERE id=$4 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [name, email, phone, id]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Updation problem!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guest updated succesfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM guests WHERE id=$1 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Deletion problem!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guest deleted succesfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
});
exports.default = router;
