import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  changePassword,
  checkAuth,
  deleteAccount,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password reset attempts. Try again later.' },
});

router.get('/check', checkAuth);
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.put('/update', protectRoute, updateProfile);
router.delete('/delete', protectRoute, deleteAccount);

router.post('/forgot-password', passwordLimiter, forgotPassword);
router.post('/reset-password', passwordLimiter, resetPassword);
router.put('/change-password', protectRoute, changePassword);

export default router;
