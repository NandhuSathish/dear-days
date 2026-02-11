import { Router } from 'express';

/**
 * Central API route aggregator.
 * All API routes are mounted from this router under /api/v1.
 */
const router = Router();

// Route mounting points — uncomment as features are implemented:
// router.use('/auth', authRoutes);
// router.use('/journals', journalRoutes);
// router.use('/pages', pageRoutes);
// router.use('/upload', uploadRoutes);
// router.use('/export', exportRoutes);

export default router;
