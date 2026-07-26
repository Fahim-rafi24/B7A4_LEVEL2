import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.use(authenticate, authorize('tenant', 'admin'));

router.post('/create', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.get('/', paymentController.getUserPayments);
router.get('/:id', paymentController.getPaymentById);

export default router;