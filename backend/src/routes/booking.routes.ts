// ─── Booking Routes ─────────────────────────────────────────────────────────
import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', bookingController.getAll);
router.get('/slots', bookingController.getSlots);
router.post('/', bookingController.create);
router.patch('/:id/cancel', bookingController.cancel);

export default router;
