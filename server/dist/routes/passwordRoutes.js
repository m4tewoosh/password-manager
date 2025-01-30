"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { authenticateToken } = require('../controllers/authController');
const { savePassword, updatePassword, getAllPasswords, deletePassword, } = require('../controllers/passwordController');
const router = express_1.default.Router();
router.get('/', authenticateToken, getAllPasswords);
router.post('/', authenticateToken, savePassword);
router.patch('/:id', authenticateToken, updatePassword);
router.delete('/:id', authenticateToken, deletePassword);
exports.default = router;
