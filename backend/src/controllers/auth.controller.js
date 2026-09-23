import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

const getJwtSecret = () => {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined in the environment');
	}

	return process.env.JWT_SECRET;
};

const createToken = (userId) =>
	jwt.sign({ userId }, getJwtSecret(), {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});

const setAuthCookie = (response, token) => {
	response.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

const publicUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
});

export const register = async (request, response) => {
	const { name, email, password } = request.body;

	if (!name || !email || !password) {
		return response.status(400).json({ message: 'Name, email, and password are required' });
	}

	const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
	if (existingUser) {
		return response.status(409).json({ message: 'An account with this email already exists' });
	}

	const user = await User.create({ name, email, password });
	const token = createToken(user._id.toString());
	setAuthCookie(response, token);

	return response.status(201).json({ user: publicUser(user), token });
};

export const login = async (request, response) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return response.status(400).json({ message: 'Email and password are required' });
	}

	const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
	if (!user || !(await user.comparePassword(password))) {
		return response.status(401).json({ message: 'Invalid email or password' });
	}

	const token = createToken(user._id.toString());
	setAuthCookie(response, token);

	return response.status(200).json({ user: publicUser(user), token });
};

export const logout = (_request, response) => {
	response.clearCookie('token');
	return response.status(200).json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (request, response) =>
	response.status(200).json({ user: publicUser(request.user) });