import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const issue = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'development-secret-change-me', { expiresIn: '7d' });
const check = (req, _res, next) => { req.validationErrors = validationResult(req).array(); next(); };

router.post('/register', [body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters.'), body('email').trim().isEmail().withMessage('Enter a valid email.'), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'), check], async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (req.validationErrors.length) return res.status(400).json({ message: req.validationErrors[0].msg });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: issue(user), user });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    next(error);
  }
});

router.post('/login', [body('email').trim().isEmail().withMessage('Enter a valid email.'), body('password').notEmpty().withMessage('Password is required.'), check], async (req, res, next) => {
  try {
    if (req.validationErrors.length) return res.status(400).json({ message: req.validationErrors[0].msg });
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    if (user.status !== 'active') return res.status(403).json({ message: 'This account is inactive. Please contact an administrator.' });
    res.json({ token: issue(user), user });
  } catch (error) { next(error); }
});

router.get('/me', protect, (req, res) => res.json({ user: req.user }));
export default router;




