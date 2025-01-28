import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
import multer from 'multer';

const { authenticateToken } = require('./controllers/authController');
const {
  saveDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
} = require('./controllers/documentController');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// db connection
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log('db connected'))
  .catch((error: unknown) => console.log('db error', error));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // what extended means?

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend React app
    credentials: true, // Allow cookies (necessary for httpOnly cookies)
  })
);

app.use('/', require('./routes/authRoutes'));

app.post('/documents', authenticateToken, upload.single('file'), saveDocument);
app.get('/documents', authenticateToken, getAllDocuments);
app.get('/documents/:id', authenticateToken, downloadDocument);
app.delete('/documents/:id', authenticateToken, deleteDocument);

const port = 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
