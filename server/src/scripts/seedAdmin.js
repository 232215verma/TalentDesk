import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Workspace Admin';

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luma_admin');

// Retire the original sample admin so only the requested account remains privileged.
if (email !== 'admin@example.com') {
  await User.updateOne({ email: 'admin@example.com' }, { $set: { role: 'user' } });
}

const existing = await User.findOne({ email }).select('+password');
if (existing) {
  existing.name = name;
  existing.password = password;
  existing.role = 'admin';
  existing.status = 'active';
  await existing.save();
  console.log(`Admin credentials updated for ${email}`);
} else {
  await User.create({ name, email, password, role: 'admin', status: 'active' });
  console.log(`Admin created for ${email}`);
}

await mongoose.disconnect();


