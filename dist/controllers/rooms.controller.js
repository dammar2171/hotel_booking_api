"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoomById = exports.getAvailableRooms = exports.getRooms = void 0;
const db_1 = __importDefault(require("../db"));
const pagination_1 = require("../utils/pagination");
const getRooms = async (req, res) => {
    const { currentPage, pageLimit, offset } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    const type = req.query.type;
    try {
        let countSql = "SELECT COUNT(*) as total FROM rooms";
        let dataSql = "SELECT * FROM rooms";
        const params = [];
        if (type) {
            countSql += " WHERE type ILIKE $1";
            dataSql += " WHERE type ILIKE $1";
            params.push(type);
        }
        dataSql += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const totalCount = await db_1.default.query(countSql, type ? [type] : []);
        const totalItems = Number(totalCount.rows[0].total);
        const result = await db_1.default.query(dataSql, [...params, pageLimit, offset]);
        return res.status(200).json({
            success: true,
            message: result.rows.length === 0 ? "No rooms found" : "Rooms fetched successfully!",
            data: result.rows,
            pagination: (0, pagination_1.buildPaginationMeta)(currentPage, pageLimit, totalItems),
        });
    }
    catch (error) {
        console.log("DATABASE_ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            data: [],
            pagination: (0, pagination_1.buildPaginationMeta)(1, 10, 0),
        });
    }
};
exports.getRooms = getRooms;
const getAvailableRooms = async (req, res) => {
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
};
exports.getAvailableRooms = getAvailableRooms;
const getRoomById = async (req, res) => {
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
};
exports.getRoomById = getRoomById;
const createRoom = async (req, res) => {
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
};
exports.createRoom = createRoom;
const updateRoom = async (req, res) => {
    const id = Number(req.params.id);
    const { room_number, type, price, is_available } = req.body;
    const sql = "UPDATE rooms SET room_number = COALESCE($1,room_number),type=COALESCE($2,type), price=COALESCE($3,price),is_available=COALESCE($4,is_available) WHERE id = $5 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [room_number, type, price, is_available, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Room updated successfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
};
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM rooms WHERE id = $1 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        return res.status(200).json({ success: true, message: "Room deleted successfully!", data: result.rows[0] });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server error!", data: null });
    }
};
exports.deleteRoom = deleteRoom;
