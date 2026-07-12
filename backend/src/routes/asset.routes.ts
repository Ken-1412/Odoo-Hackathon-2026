// ─── Asset Routes ───────────────────────────────────────────────────────────
import { Router } from 'express';
import assetController from '../controllers/asset.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { uploadImage } from '../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/', assetController.getAll);
router.get('/:id', assetController.getById);
router.get('/:id/history', assetController.getHistory);
router.post('/', authorize('Administrator', 'Asset Manager'), assetController.create);
router.patch('/:id', authorize('Administrator', 'Asset Manager'), assetController.update);
router.delete('/:id', authorize('Administrator'), assetController.delete);
router.post('/:id/image', authorize('Administrator', 'Asset Manager'), uploadImage.single('image'), assetController.uploadImage);

export default router;
