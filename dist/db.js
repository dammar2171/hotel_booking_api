"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME
});
pool.on("connect", () => {
    console.log("Database connected successfully!");
});
pool.on("error", (error) => {
    console.log("DATABASE_CONNECTION_ERROR: ", error);
});
exports.default = pool;
