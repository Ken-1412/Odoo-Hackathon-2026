// ─── Maintenance Routes ─────────────────────────────────────────────────────
import { Router } from 'express';
import maintenanceController from '../controllers/maintenance.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { uploadImage } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', maintenanceController.getAll);
router.get('/:id', maintenanceController.getById);
router.post('/', maintenanceController.create);
router.patch('/:id/advance', authorize('Administrator', 'Asset Manager'), maintenanceController.advance);
router.post('/:id/image', uploadImage.single('image'), maintenanceController.uploadImage);

export default router;
