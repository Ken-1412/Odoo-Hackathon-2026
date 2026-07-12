// ─── Dashboard & Reports Routes ─────────────────────────────────────────────
import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/admin-stats', authorize('Administrator'), dashboardController.getAdminStats);
router.get('/utilization', dashboardController.getUtilization);
router.get('/maintenance-frequency', dashboardController.getMaintenanceFrequency);
router.get('/most-used', dashboardController.getMostUsed);
router.get('/recent-activity', dashboardController.getRecentActivity);

export default router;
