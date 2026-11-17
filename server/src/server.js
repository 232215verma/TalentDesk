import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
}));
app.use(express.json({ limit: '10kb' }));

let connectionPromise;
async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luma_admin',
    );
  }
  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || (['ValidationError', 'CastError', 'BSONTypeError'].includes(err.name) ? 400 : 500);
  const message = status === 500 ? 'Something went wrong. Please try again.' : err.name === 'ValidationError' ? 'Please check the submitted fields.' : err.message;
  res.status(status).json({ message, ...(err.errors ? { errors: err.errors } : {}) });
});

const port = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  connectDatabase()
    .then(() => app.listen(port, () => console.log(`TalentDesk API listening on ${port}`)))
    .catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
}

export default app;



