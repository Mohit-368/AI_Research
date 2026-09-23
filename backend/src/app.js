import cookieParser from 'cookie-parser';
import express from 'express';

import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/health', (_request, response) => {
	response.status(200).json({ status: 'ok' });
});

export default app;
