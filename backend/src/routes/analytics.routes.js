import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/metrics', authenticate, getDashboardMetrics);

export default router;
