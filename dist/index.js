"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const rooms_route_1 = __importDefault(require("./routes/rooms.route"));
const guests_route_1 = __importDefault(require("./routes/guests.route"));
const bookings_route_1 = __importDefault(require("./routes/bookings.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const stats_route_1 = __importDefault(require("./routes/stats.route"));
const errorHandler_1 = require("./middleware/errorHandler");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 100,
    max: 100,
    message: {
        success: false,
        message: "Too many attempts. Try again after 15  minutes!",
        data: null
    }
});
app.use(limiter);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        data: {
            uptime: process.uptime(),
            timestamp: new Date().toISOString
        }
    });
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use("/auth", auth_route_1.default);
app.use("/rooms", rooms_route_1.default);
app.use("/guests", guests_route_1.default);
app.use("/bookings", bookings_route_1.default);
app.use("/stats", stats_route_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Open http://localhost:${port} in your browser`);
});
