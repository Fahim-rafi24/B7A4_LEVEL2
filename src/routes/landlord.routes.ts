import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as propertyController from '../controllers/property.controller';
import * as rentalController from '../controllers/rental.controller';

const router = Router();

router.use(authenticate, authorize('landlord', 'admin'));


router.get('/properties', propertyController.getLandlordProperties);
router.post('/properties', propertyController.createProperty);
router.put('/properties/:id', propertyController.updateProperty);
router.delete('/properties/:id', propertyController.deleteProperty);


router.get('/requests', rentalController.getLandlordRequests);
router.patch('/requests/:id', rentalController.updateRentalStatus);

export default router;