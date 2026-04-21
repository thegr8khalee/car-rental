import express from 'express';
import { protectAdminRoute } from '../middleware/protectAdminRoute.js';
import {
  getProfitabilityMetrics,
  getProfitabilityByDateRange,
  getInventoryAuditTrail,
} from '../controllers/profitability.controller.js';

const router = express.Router();

// Get overall profitability metrics
router.get('/metrics', protectAdminRoute, getProfitabilityMetrics);

// Get profitability for a specific date range
router.get('/date-range', protectAdminRoute, getProfitabilityByDateRange);

// Get inventory audit trail with filtering
router.get('/audit-trail', protectAdminRoute, getInventoryAuditTrail);

export default router;
