import express from 'express';
const cors = require('cors');
const {
  registerUser,
  loginUser,
  logoutUser,
  authenticateToken,
  refreshToken,
  authorizeUser,
} = require('../controllers/authController');
const { getUser } = require('../controllers/userController');
const {
  savePassword,
  updatePassword,
  getAllPasswords,
  deletePassword,
} = require('../controllers/passwordController');

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', refreshToken);

// protected routes
router.post('/logout', authenticateToken, logoutUser);
router.post('/auth', authenticateToken, authorizeUser);

// move to userRoutes
router.get('/user', authenticateToken, getUser);

//move to passwordRoutes
router.get('/passwords', authenticateToken, getAllPasswords);
router.patch('/passwords/:id', authenticateToken, updatePassword);
router.post('/passwords', authenticateToken, savePassword);
router.delete('/passwords/:id', authenticateToken, deletePassword);

module.exports = router;
