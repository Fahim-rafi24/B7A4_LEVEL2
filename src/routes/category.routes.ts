import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

const router = Router();

// public routes
router.get('/', categoryController.getAllCategories);

export default router;