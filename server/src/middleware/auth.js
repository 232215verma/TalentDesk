import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, _res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    if (!token) return next(Object.assign(new Error('Please sign in to continue.'), { status: 401 }));
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
    const user = await User.findById(payload.id);
    if (!user || user.status !== 'active') return next(Object.assign(new Error('This account is unavailable.'), { status: 401 }));
    req.user = user;
    next();
  } catch { next(Object.assign(new Error('Your session has expired. Please sign in again.'), { status: 401 })); }
}
export function authorize(...roles) { return (req, _res, next) => roles.includes(req.user?.role) ? next() : next(Object.assign(new Error('You do not have permission to do that.'), { status: 403 })); }
