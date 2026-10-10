import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const getToken = (request) => {
  const cookieToken = request.cookies?.token;
  if (cookieToken) return cookieToken;
  const authorization = request.headers.authorization;
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
};

export default async function protect(request, response, next) {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return response.status(500).json({ message: 'Authentication is not configured correctly' });
    }
    const token = getToken(request);
    if (!token) return response.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!payload.userId || !mongoose.isValidObjectId(payload.userId)) {
      return response.status(401).json({ message: 'Invalid or expired token' });
    }
    const user = await User.findById(payload.userId).select('_id name email');
    if (!user) return response.status(401).json({ message: 'Invalid or expired token' });
    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired token' });
  }
}
