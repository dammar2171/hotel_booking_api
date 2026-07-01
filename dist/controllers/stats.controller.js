"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const db_1 = __importDefault(require("../db"));
const getStats = async (req, res, next) => {
    try {
        const roomStat = await db_1.default.query(`
      SELECT
        COUNT(*) AS total_rooms,
        COUNT(*) FILTER (WHERE is_available = true)  AS available_rooms,
        COUNT(*) FILTER (WHERE is_available = false) AS occupied_rooms
      FROM rooms;
    `);
        const guestStat = await db_1.default.query(`
      SELECT COUNT(*) AS total_guests FROM guests;
    `);
        const bookingStat = await db_1.default.query(`
      SELECT
        COUNT(*) AS total_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_bookings,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'confirmed'), 0) AS total_revenue
      FROM bookings;
    `);
        const topRoomTypeStat = await db_1.default.query(`
      SELECT r.type AS top_room_type, COUNT(b.id) AS booking_count
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      GROUP BY r.type
      ORDER BY booking_count DESC
      LIMIT 1;
    `);
        const totalRooms = Number(roomStat.rows[0].total_rooms);
        const availableRooms = Number(roomStat.rows[0].available_rooms);
        const occupiedRooms = Number(roomStat.rows[0].occupied_rooms); // ← fixed
        const occupancyRate = totalRooms === 0
            ? 0
            : Math.round((occupiedRooms / totalRooms) * 100);
        const topBookingRoom = topRoomTypeStat.rows.length > 0
            ? topRoomTypeStat.rows[0].top_room_type
            : "No bookings yet";
        const stat = {
            totalRooms,
            availableRooms,
            occupiedRooms,
            totalGuests: Number(guestStat.rows[0].total_guests),
            totalBookings: Number(bookingStat.rows[0].total_bookings),
            confirmedBookings: Number(bookingStat.rows[0].confirmed_bookings),
            cancelledBookings: Number(bookingStat.rows[0].cancelled_bookings),
            totalRevenue: Number(bookingStat.rows[0].total_revenue),
            occupancyRate,
            topBookingRoom,
        };
        return res.status(200).json({
            success: true,
            message: "Stats fetched successfully!",
            data: stat,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
