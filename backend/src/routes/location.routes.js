import express from 'express';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';
import {
  createLocation,
  deleteLocation,
  listLocations,
  updateLocation,
} from '../controllers/location.controller.js';

const router = express.Router();

router.get('/', listLocations);
router.post('/', protectAdminRoute, createLocation);
router.patch('/:id', protectAdminRoute, updateLocation);
router.delete('/:id', protectAdminRoute, deleteLocation);

export default router;
