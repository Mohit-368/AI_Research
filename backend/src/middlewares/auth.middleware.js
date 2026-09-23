import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const getToken = (request) => {
	if (request.cookies.token) {
		return request.cookies.token;
	}

	const authorization = request.headers.authorization;
	return authorization?.startsWith('Bearer ')
		? authorization.substring('Bearer '.length)
		: null;
};

const protect = async (request, response, next) => {
	try {
		if (!process.env.JWT_SECRET) {
			return response.status(500).json({ message: 'JWT_SECRET is not configured' });
		}

		const token = getToken(request);
		if (!token) {
			return response.status(401).json({ message: 'Authentication required' });
		}

		const { userId } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(userId);
		if (!user) {
			return response.status(401).json({ message: 'User no longer exists' });
		}

		request.user = user;
		return next();
	} catch (_error) {
		return response.status(401).json({ message: 'Invalid or expired token' });
	}
};

export default protect;