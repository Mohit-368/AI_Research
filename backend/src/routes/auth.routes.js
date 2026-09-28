import express from 'express';

import {
	getCurrentUser,
	login,
	logout,
	register,
} from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const Authrouter = express.Router();

Authrouter.post('/register', register);
Authrouter.post('/login', login);
Authrouter.post('/logout', logout);
Authrouter.get('/me', protect, getCurrentUser);

export default Authrouter;