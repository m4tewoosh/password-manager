import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();

// db connection
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log('db connected'))
  .catch((error: unknown) => console.log('db error', error));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // what extended means?

// cors
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend React app
    credentials: true, // Allow cookies (necessary for httpOnly cookies)
  })
);

// routes
app.use('/', authRoutes);
app.use('/passwords', passwordRoutes);
app.use('/documents', documentRoutes);

const port = 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
