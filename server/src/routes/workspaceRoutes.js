import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Workspace from '../models/Workspace.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', async (_req, res, next) => {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { key: 'primary' },
      { $setOnInsert: { name: 'Growth Tech' } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.json({ workspace });
  } catch (error) { next(error); }
});

router.put('/', authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Workspace name must be 2–50 characters.'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    const workspace = await Workspace.findOneAndUpdate(
      { key: 'primary' },
      { $set: { name: req.body.name.trim() } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json({ workspace });
  } catch (error) { next(error); }
});

export default router;
