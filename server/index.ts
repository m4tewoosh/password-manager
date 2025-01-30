import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import crypto from 'crypto';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

// const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

declare module 'express-session' {
  export interface SessionData {
    masterKey: string;
  }
}

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
  session({
    name: 'sid',
    secret: crypto.randomBytes(64).toString('hex'), // Rotuj regularnie!
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // max age set to 24 hours ( hours * minutes * seconds * milliseconds)
      httpOnly: true,
      // secure: add for prod environment
      // sameSite: to check
    },
  })
);

// cors
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // Frontend React app
    credentials: true, // Allow cookies (necessary for httpOnly cookies)
  })
);

// routes
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/passwords', passwordRoutes);
app.use('/documents', documentRoutes);

const port = 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
