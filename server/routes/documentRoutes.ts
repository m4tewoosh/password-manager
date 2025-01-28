import express from 'express';
import multer from 'multer';
const { authenticateToken } = require('../controllers/authController');
const {
  saveDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
} = require('../controllers/documentController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', authenticateToken, getAllDocuments);
router.post(
  '/documents',
  authenticateToken,
  upload.single('file'),
  saveDocument
);
router.get('/:id', authenticateToken, downloadDocument);
router.delete('/:id', authenticateToken, deleteDocument);

module.exports = router;
