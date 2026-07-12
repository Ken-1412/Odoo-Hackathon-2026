// ─── Audit Routes ───────────────────────────────────────────────────────────
import { Router } from 'express';
import auditController from '../controllers/audit.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', auditController.getAll);
router.get('/:id', auditController.getById);
router.post('/', authorize('Administrator', 'Asset Manager'), auditController.create);
router.patch('/:id/items/:itemId', auditController.updateItem);
router.patch('/:id/close', authorize('Administrator', 'Asset Manager'), auditController.closeCycle);
router.get('/:id/discrepancy-report', auditController.getDiscrepancyReport);

export default router;
