"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoomById = exports.getAvailableRooms = exports.getRooms = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_1 = require("../utils/pagination");
const AppError_1 = require("../utils/AppError");
const getRooms = async (req, res, next) => {
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
        next(error);
    }
};
exports.getRooms = getRooms;
const getAvailableRooms = async (req, res, next) => {
    const sql = "SELECT * FROM rooms WHERE is_available = true;";
    try {
        const result = await db_1.default.query(sql);
        if (result.rows.length === 0) {
            throw new AppError_1.AppError("No rooms available!", 404);
        }
        return res.status(200).json({ success: true, message: "Rooms available fetched!", data: result.rows });
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailableRooms = getAvailableRooms;
const getRoomById = async (req, res, next) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM rooms WHERE id = $1;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Room not found!", 404);
        }
        return res.status(200).json({ success: true, message: "Room found!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.getRoomById = getRoomById;
const createRoom = async (req, res, next) => {
    const { room_number, type, price, is_available } = req.body;
    const sql = "INSERT INTO rooms(room_number,type,price,is_available)VALUES($1,$2,$3,$4) RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [room_number, type, price, is_available]);
        return res.status(201).json({ success: true, message: "Room created sucessfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoom = createRoom;
const updateRoom = async (req, res, next) => {
    const id = Number(req.params.id);
    const { room_number, type, price, is_available } = req.body;
    const sql = "UPDATE rooms SET room_number = COALESCE($1,room_number),type=COALESCE($2,type), price=COALESCE($3,price),is_available=COALESCE($4,is_available) WHERE id = $5 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [room_number, type, price, is_available, id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Room not found!", 404);
        }
        return res.status(200).json({ success: true, message: "Room updated successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res, next) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM rooms WHERE id = $1 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Room not found!", 404);
        }
        return res.status(200).json({ success: true, message: "Room deleted successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRoom = deleteRoom;
