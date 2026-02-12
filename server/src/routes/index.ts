import { Router } from 'express';
import authRoutes from './auth.routes.js';
import journalRoutes from './journal.routes.js';

/**
 * Central API route aggregator.
 * All API routes are mounted from this router under /api/v1.
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/journals', journalRoutes);

// Route mounting points — uncomment as features are implemented:
// router.use('/pages', pageRoutes);
// router.use('/upload', uploadRoutes);
// router.use('/export', exportRoutes);

export default router;
