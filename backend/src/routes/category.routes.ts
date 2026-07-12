// ─── Category Routes ────────────────────────────────────────────────────────
import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', authorize('Administrator'), categoryController.create);
router.patch('/:id', authorize('Administrator'), categoryController.update);
router.delete('/:id', authorize('Administrator'), categoryController.delete);

export default router;
