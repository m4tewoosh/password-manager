import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../controllers/authController';
import {
  saveDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
} from '../controllers/documentController';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', authenticateToken, getAllDocuments);
router.post('/', authenticateToken, upload.single('file'), saveDocument);
router.get('/:id', authenticateToken, downloadDocument);
router.delete('/:id', authenticateToken, deleteDocument);

export default router;
