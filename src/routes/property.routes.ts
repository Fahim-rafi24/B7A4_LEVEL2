import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as propertyController from '../controllers/property.controller';
import * as reviewController from '../controllers/review.controller';

const router = Router();


// public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);



router.get('/:propertyId/reviews', reviewController.getPropertyReviews);
router.post('/', authenticate, authorize('landlord', 'admin'), propertyController.createProperty);
router.put('/:id', authenticate, authorize('landlord', 'admin'), propertyController.updateProperty);
router.delete('/:id', authenticate, authorize('landlord', 'admin'), propertyController.deleteProperty);

export default router;