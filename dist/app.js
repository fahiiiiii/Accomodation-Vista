"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelRoutes_1 = __importDefault(require("./routes/hotelRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', hotelRoutes_1.default);
app.use('/api', uploadRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// app.use('/uploads', express.static('public/uploads'));
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
exports.default = app;
