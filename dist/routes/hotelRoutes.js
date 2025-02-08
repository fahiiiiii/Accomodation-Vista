"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelController_1 = require("../controllers/hotelController");
// import { validateHotel } from './../middleware/validate';
const router = express_1.default.Router();
router.post('/hotel', hotelController_1.createHotel);
router.get('/hotel/:hotelId', hotelController_1.getHotel);
router.get('/hotels', hotelController_1.getAllHotels);
router.put('/hotel/:hotelId', hotelController_1.updateHotel);
exports.default = router;
