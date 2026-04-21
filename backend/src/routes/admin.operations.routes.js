import express from 'express';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';
import { addBlog, addCar, deleteBlog, deleteCar, getNewsletterStats, getRecentBroadcasts, sendNewsletter, updateBlog, updateCar, decodeVin } from '../controllers/admin.operations.controller.js';

const router = express.Router();

router.get('/decode-vin/:vin', protectAdminRoute, decodeVin);

router.post('/add-car', protectAdminRoute, addCar);
router.put('/update-car/:id', protectAdminRoute, updateCar);
router.delete('/delete-car/:id', protectAdminRoute, deleteCar);

router.post('/add-blog', protectAdminRoute, addBlog);
router.put('/update-blog/:id', protectAdminRoute, updateBlog);
router.delete('/delete-blog/:id', protectAdminRoute, deleteBlog);
router.get('/newsletter/stats', protectAdminRoute, getNewsletterStats);
router.get('/newsletter/broadcasts', protectAdminRoute, getRecentBroadcasts);
router.post('/newsletter/send', protectAdminRoute, sendNewsletter);

export default router;
