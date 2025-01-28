import express from 'express';
const {
  registerUser,
  loginUser,
  logoutUser,
  authenticateToken,
  refreshToken,
  authorizeUser,
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', refreshToken);

router.get('/user', authenticateToken, getUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/auth', authenticateToken, authorizeUser);

module.exports = router;
