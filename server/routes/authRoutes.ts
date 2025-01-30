import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  authenticateToken,
  refreshToken,
  authorizeUser,
} from '../controllers/authController';
import { getUser } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', refreshToken);

router.get('/user', authenticateToken, getUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/auth', authenticateToken, authorizeUser);

export default router;
