import { Router } from 'express';
import { signup, login, refresh, logout, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();



// all auth routes
router.post('/register', signup);
router.post('/login', login);
router.get('/me', authenticate, getProfile);



router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;