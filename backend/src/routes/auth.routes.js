import express from 'express';
import { getCurrentUser, login, logout, register } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import rateLimit from '../middlewares/rate-limit.middleware.js';
import { loginSchema, registerSchema } from '../schemas/request.schemas.js';

const router = express.Router();
router.post('/register', rateLimit({ windowMs: 15 * 60_000, max: 10 }), validate(registerSchema), register);
router.post('/login', rateLimit({ windowMs: 15 * 60_000, max: 20 }), validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);
export default router;
