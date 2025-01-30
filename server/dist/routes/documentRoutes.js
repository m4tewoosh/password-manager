"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const { authenticateToken } = require('../controllers/authController');
const { saveDocument, getAllDocuments, downloadDocument, deleteDocument, } = require('../controllers/documentController');
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.get('/', authenticateToken, getAllDocuments);
router.post('/', authenticateToken, upload.single('file'), saveDocument);
router.get('/:id', authenticateToken, downloadDocument);
router.delete('/:id', authenticateToken, deleteDocument);
exports.default = router;
