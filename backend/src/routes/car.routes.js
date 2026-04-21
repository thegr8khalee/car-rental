import express from 'express';
import { getAllCars, getCarById, Search } from '../controllers/car.controller.js';
import { getCarAvailability } from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/get-all', getAllCars);
router.get('/get/:id', getCarById);
router.get('/search', Search);
router.get('/:id/availability', getCarAvailability);

export default router;
