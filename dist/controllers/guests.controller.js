"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuest = exports.updateGuest = exports.createGuest = exports.getGuestById = exports.getGuests = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_1 = require("../utils/pagination");
const AppError_1 = require("../utils/AppError");
const getGuests = async (req, res, next) => {
    const { currentPage, pageLimit, offset } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    try {
        const totalGuests = await db_1.default.query("SELECT COUNT(*) as total FROM guests");
        const totalItem = Number(totalGuests.rows[0].total);
        const sql = "SELECT * FROM guests ORDER BY id LIMIT $1 OFFSET $2;";
        const result = await db_1.default.query(sql, [pageLimit, offset]);
        return res.status(200).json({
            success: true,
            message: result.rows.length === 0 ? "Guests not found!" : "Guests fetched successfully!",
            data: result.rows,
            pagination: (0, pagination_1.buildPaginationMeta)(currentPage, pageLimit, totalItem),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getGuests = getGuests;
const getGuestById = async (req, res, next) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM guests WHERE id =$1;";
    try {
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Guest not found!", 404);
        }
        return res.status(200).json({ success: true, message: "Guest found successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.getGuestById = getGuestById;
const createGuest = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const sql = "INSERT INTO guests(name,email,phone) VALUES($1,$2,$3) RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [name, email, phone]);
        return res.status(201).json({ success: true, message: "Guest inserted successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.createGuest = createGuest;
const updateGuest = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const id = Number(req.params.id);
    const sql = "UPDATE guests SET name=COALESCE($1,name),email=COALESCE($2,email),phone=COALESCE($3,phone) WHERE id=$4 RETURNING *;";
    try {
        const result = await db_1.default.query(sql, [name, email, phone, id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Guest not found!", 404);
        }
        return res.status(200).json({ success: true, message: "Guest updated successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.updateGuest = updateGuest;
const deleteGuest = async (req, res, next) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM guests WHERE id=$1 RETURNING *;";
    const find_booking_sql = "SELECT * FROM bookings WHERE guest_id =$1;";
    try {
        const booking_detail = await db_1.default.query(find_booking_sql, [id]);
        if ((booking_detail.rowCount ?? 0) > 0) {
            throw new AppError_1.AppError("Cannot delete guest with existing bookings", 400);
        }
        const result = await db_1.default.query(sql, [id]);
        if (result.rowCount === 0) {
            throw new AppError_1.AppError("Deletion problem!", 500);
        }
        return res.status(200).json({ success: true, message: "Guest deleted successfully!", data: result.rows[0] });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteGuest = deleteGuest;
