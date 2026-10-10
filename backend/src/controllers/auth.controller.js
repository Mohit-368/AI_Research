
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw Object.assign(
      new Error('JWT_SECRET must be configured with at least 32 characters'),
      { status: 500 },
    );
  }

  return process.env.JWT_SECRET;
};

const createToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  });

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = async (request, response) => {
  const { name, email, password } = request.body;

  try {
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    const token = createToken(user._id.toString());
    response.cookie('token', token, cookieOptions());

    return response.status(201).json({ user: publicUser(user), token });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        message: 'An account with this email already exists',
      });
    }

    throw error;
  }
};

export const login = async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return response.status(401).json({
      message: 'Invalid email or password',
    });
  }

  const token = createToken(user._id.toString());
  response.cookie('token', token, cookieOptions());

  return response.status(200).json({
    user: publicUser(user),
    token,
  });
};

export const logout = (_request, response) => {
  const { httpOnly, secure, sameSite, path } = cookieOptions();

  response.clearCookie('token', {
    httpOnly,
    secure,
    sameSite,
    path,
  });

  return response.status(200).json({
    message: 'Logged out successfully',
  });
};

export const getCurrentUser = async (request, response) =>
  response.status(200).json({
    user: publicUser(request.user),
  });
