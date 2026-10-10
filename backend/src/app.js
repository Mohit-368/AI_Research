import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import researchRoutes from './routes/chat.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
app.disable('x-powered-by');
if (process.env.CLIENT_URL) {
  app.use(cors({ origin: process.env.CLIENT_URL.split(',').map((origin) => origin.trim()), credentials: true }));
}
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
// Canonical API: /api/chat, /api/chat/:id and /api/chat/feedback/:id.
app.use('/api', researchRoutes);
// Compatibility mount for clients that previously called /api/chat/chat.
app.use('/api/chat', researchRoutes);
app.use((_request, response) => response.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

export default app;
