import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import researchRoutes from './routes/chat.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
app.disable('x-powered-by');
const allowedOrigins = [
  "http://localhost:5173",
  "https://research-os-tawny.vercel.app",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject the origin without throwing a server error.
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
