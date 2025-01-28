import express from 'express';
const { authenticateToken } = require('../controllers/authController');
const {
  savePassword,
  updatePassword,
  getAllPasswords,
  deletePassword,
} = require('../controllers/passwordController');

const router = express.Router();

router.get('/', authenticateToken, getAllPasswords);
router.post('/', authenticateToken, savePassword);
router.patch('/:id', authenticateToken, updatePassword);
router.delete('/:id', authenticateToken, deletePassword);

module.exports = router;
