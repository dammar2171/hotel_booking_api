"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingByGuestId = exports.cancelBooking = exports.createBooking = exports.getBookingById = exports.getBookings = void 0;
const db_1 = __importDefault(require("../db"));
const pagination_1 = require("../utils/pagination");
const getBookings = async (req, res) => {
    const { currentPage, pageLimit, offset } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
    try {
        const totalCount = await db_1.default.query(" SELECT COUNT(*) as total FROM bookings");
        const totalItem = Number(totalCount.rows[0].total);
        const sql = "SELECT * FROM bookings ORDER BY id limit $1 OFFSET $2;";
        const result = await db_1.default.query(sql, [pageLimit, offset]);
        return res.status(200).json({
            success: true,
            message: result.rows ? "No booking found!" : "Booking fetched successfully!",
            data: result.rows,
            pagination: (0, pagination_1.buildPaginationMeta)(currentPage, pageLimit, totalItem)
        });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server problem",
            data: [],
            pagination: (0, pagination_1.buildPaginationMeta)(1, 10, 0)
        });
    }
};
exports.getBookings = getBookings;
const getBookingById = async (req, res) => {
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
};
exports.getBookingById = getBookingById;
const createBooking = async (req, res) => {
    const { guest_id, room_id, check_in, check_out } = req.body;
    const sql = "INSERT INTO bookings (guest_id,room_id,check_in,check_out,total_price,status)VALUES($1,$2,$3,$4,$5,$6) RETURNING *;";
    const check_room_sql = "SELECT * FROM rooms WHERE id=$1;";
    const update_room_sql = "UPDATE rooms SET is_available= $1 WHERE id =$2;";
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const room_detail = await client.query(check_room_sql, [room_id]);
        if (room_detail.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Room not found!", data: null });
        }
        const room_available = room_detail.rows[0].is_available;
        if (!room_available) {
            await client.query("ROLLBACK");
            return res.status(400).json({ success: false, message: "Room is not available!", data: null });
        }
        const check_in_date = new Date(check_in);
        const check_out_date = new Date(check_out);
        const oneDay = 1000 * 60 * 60 * 24;
        // if(check_in_date >= check_out_date){
        //   await client.query("ROLLBACK");
        //   return res.status(400).json({success:false,message:"Check-in date must be before check-out date!",data:null})
        // }
        const diffInTime = check_out_date.getTime() - check_in_date.getTime();
        const total_day = Math.round(diffInTime / oneDay);
        const roomPrice = room_detail.rows[0].price;
        const total_price = roomPrice * total_day;
        const result = await client.query(sql, [guest_id, room_id, check_in, check_out, total_price, "confirmed"]);
        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(500).json({ success: false, message: "Insertion problem!", data: null });
        }
        await client.query(update_room_sql, [false, room_id]);
        await client.query("COMMIT");
        return res.status(201).json({ success: true, message: "Room booked successfully!", data: result.rows[0] });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
    finally {
        client.release();
    }
};
exports.createBooking = createBooking;
const cancelBooking = async (req, res) => {
    const id = Number(req.params.id);
    const booking_detail_sql = "SELECT * FROM bookings WHERE id=$1;";
    const sql = "UPDATE bookings SET status = $1 WHERE id=$2 RETURNING *;";
    const update_room_available_sql = "UPDATE rooms SET is_available =$1 WHERE id=$2 ;";
    const client = await db_1.default.connect();
    try {
        await client.query("BEGIN");
        const booking_detail = await client.query(booking_detail_sql, [id]);
        if (booking_detail.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Booking not found!", data: null });
        }
        if (booking_detail.rows[0].status === "cancelled") {
            await client.query("ROLLBACK");
            return res.status(400).json({ success: false, message: "Already cancelled room!", data: null });
        }
        const result = await client.query(sql, ["cancelled", id]);
        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ success: false, message: "Updation problem!", data: null });
        }
        const room_id = result.rows[0].room_id;
        await client.query(update_room_available_sql, [true, room_id]);
        await client.query("COMMIT");
        return res.status(200).json({ success: true, message: "Booking cancelled!", data: result.rows[0] });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
    finally {
        client.release();
    }
};
exports.cancelBooking = cancelBooking;
const getBookingByGuestId = async (req, res) => {
    const guestId = Number(req.params.guestId);
    const sql = "SELECT * FROM bookings WHERE guest_id=$1;";
    try {
        const result = await db_1.default.query(sql, [guestId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "No guest found with booking!", data: null });
        }
        return res.status(200).json({ success: true, message: "Guest found with booking!", data: result.rows });
    }
    catch (error) {
        console.log("DATABASE_ERROR: ", error);
        return res.status(500).json({ success: false, message: "Internal server problem", data: null });
    }
};
exports.getBookingByGuestId = getBookingByGuestId;
