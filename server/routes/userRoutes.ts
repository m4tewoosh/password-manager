import { Router } from 'express';
import { authenticateToken } from '../controllers/authController';
import { getUser, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', authenticateToken, getUser);
router.patch('/', authenticateToken, updateUser);

export default router;
