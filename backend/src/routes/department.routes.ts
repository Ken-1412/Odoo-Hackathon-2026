// ─── Department Routes ──────────────────────────────────────────────────────
import { Router } from 'express';
import departmentController from '../controllers/department.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);
router.post('/', authorize('Administrator'), departmentController.create);
router.patch('/:id', authorize('Administrator'), departmentController.update);
router.patch('/:id/status', authorize('Administrator'), departmentController.toggleStatus);
router.delete('/:id', authorize('Administrator'), departmentController.delete);

export default router;
