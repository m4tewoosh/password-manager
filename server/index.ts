import express from 'express';
import mongoose from 'mongoose';

//can be changed to import?
const cors = require('cors');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

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

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend React app
    credentials: true, // Allow cookies (necessary for httpOnly cookies)
  })
);

app.use('/', require('./routes/authRoutes'));
// app.use('/user', UserRouter);

const port = 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
