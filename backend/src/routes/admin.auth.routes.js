import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  adminLogin,
  adminLogout,
  adminSignup,
} from '../controllers/admin.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';

const router = express.Router();

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

router.post('/signup', adminAuthLimiter, adminSignup);
router.post('/login', adminAuthLimiter, adminLogin);
router.post('/logout', adminLogout);
router.get('/check', checkAuth);

export default router;
