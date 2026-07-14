"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const isProduction = process.env.NODE_ENV === "production";
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false }
        : false,
});
pool.on("connect", () => {
    console.log("✅ Database connected successfully!");
});
pool.on("error", (err) => {
    console.error("❌ Database connection error:", err);
});
exports.default = pool;
