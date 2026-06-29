"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const guests_1 = __importDefault(require("./routes/guests"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const auths_1 = __importDefault(require("./routes/auths"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});
app.use("/auth", auths_1.default);
app.use("/rooms", rooms_1.default);
app.use("/guests", guests_1.default);
app.use("/bookings", bookings_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Open http://localhost:${port} in your browser`);
});
