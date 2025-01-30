import { Router } from 'express';
import { authenticateToken } from '../controllers/authController';
import {
  savePassword,
  updatePassword,
  getAllPasswords,
  deletePassword,
} from '../controllers/passwordController';

const router = Router();

router.get('/', authenticateToken, getAllPasswords);
router.post('/', authenticateToken, savePassword);
router.patch('/:id', authenticateToken, updatePassword);
router.delete('/:id', authenticateToken, deletePassword);

export default router;
