"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR]: ${req.method} ${req.url} ->`, err);
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
        data: null
    });
};
exports.errorHandler = errorHandler;
