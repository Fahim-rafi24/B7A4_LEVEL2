import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as reviewController from '../controllers/review.controller';

const router = Router();

router.post('/', authenticate, authorize('tenant'), reviewController.createReview);

export default router;