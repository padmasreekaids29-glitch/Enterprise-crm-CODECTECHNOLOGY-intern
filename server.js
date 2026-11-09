import 'express-async-errors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import { protect } from './src/middleware/auth.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import leadRoutes from './src/routes/leads.js';
import dealRoutes from './src/routes/deals.js';
import activityRoutes from './src/routes/activities.js';
import emailRoutes from './src/routes/emails.js';
import dashboardRoutes from './src/routes/dashboard.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/leads', protect, leadRoutes);
app.use('/api/deals', protect, dealRoutes);
app.use('/api/activities', protect, activityRoutes);
app.use('/api/emails', protect, emailRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate value: already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));
