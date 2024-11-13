import express from 'express';
import { createHotel ,getHotel,getAllHotels, updateHotel } from '../controllers/hotelController';
// import { validateHotel } from './../middleware/validate';

const router = express.Router();

router.post('/hotel', createHotel);
router.get('/hotel/:hotelId', getHotel);
router.get('/hotels', getAllHotels);
router.put('/hotel/:hotelId', updateHotel);

export default router;



