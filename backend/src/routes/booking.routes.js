import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';
import {
  adminBookingMetrics,
  adminListBookings,
  adminUpdateBookingStatus,
  cancelBooking,
  createBooking,
  getBooking,
  listMyBookings,
} from '../controllers/booking.controller.js';

const router = express.Router();

// User
router.post('/', protectRoute, createBooking);
router.get('/mine', protectRoute, listMyBookings);
router.get('/:id', protectRoute, getBooking);
router.patch('/:id/cancel', protectRoute, cancelBooking);

// Admin
router.get('/admin/list', protectAdminRoute, adminListBookings);
router.get('/admin/metrics', protectAdminRoute, adminBookingMetrics);
router.patch('/admin/:id/status', protectAdminRoute, adminUpdateBookingStatus);

export default router;
