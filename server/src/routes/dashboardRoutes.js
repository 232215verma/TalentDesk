import { Router } from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
const router = Router(); router.use(protect, authorize('admin'));
router.get('/stats', async (_req, res, next) => { try { const [total, active, inactive, admins, recentUsers] = await Promise.all([User.countDocuments(), User.countDocuments({ status: 'active' }), User.countDocuments({ status: 'inactive' }), User.countDocuments({ role: 'admin' }), User.find().sort({ createdAt: -1 }).limit(5)]); res.json({ total, active, inactive, admins, recentUsers }); } catch (e) { next(e); } });
export default router;
