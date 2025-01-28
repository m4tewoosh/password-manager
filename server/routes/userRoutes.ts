import express from 'express';
const { authenticateToken } = require('../controllers/authController');
const { getUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticateToken, getUser);
router.patch('/', authenticateToken, updateUser);

module.exports = router;
