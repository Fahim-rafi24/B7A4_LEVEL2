import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as rentalController from '../controllers/rental.controller';

const router = Router();

router.use(authenticate);

router.post('/', authorize('tenant'), rentalController.createRental);
router.get('/', rentalController.getUserRentals);
router.get('/:id', rentalController.getRentalById);

export default router;