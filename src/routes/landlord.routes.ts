import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as propertyController from '../controllers/property.controller';
import * as rentalController from '../controllers/rental.controller';

const router = Router();

router.use(authenticate, authorize('landlord', 'admin'));

// post, put, delete apis
router.get('/properties', propertyController.getLandlordProperties);
router.get('/requests', rentalController.getLandlordRequests);
router.patch('/requests/:id', rentalController.updateRentalStatus);

export default router;