import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // strips any keys starting with '$' or containing '.' to prevent NoSQL injection

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
