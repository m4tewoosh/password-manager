"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { authenticateToken } = require('../controllers/authController');
const { getUser, updateUser } = require('../controllers/userController');
const router = express_1.default.Router();
router.get('/', authenticateToken, getUser);
router.patch('/', authenticateToken, updateUser);
exports.default = router;
