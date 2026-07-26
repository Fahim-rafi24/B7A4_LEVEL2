import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import * as adminController from '../controllers/admin.controller';
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUserStatus);
router.get('/properties', adminController.getAllProperties);
router.get('/rentals', adminController.getAllRentals);


// add one necessity route here
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

export default router;