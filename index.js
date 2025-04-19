import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import updateRoutes from './routes/update.js';
import fetchRoutes from './routes/fetch.js';
import statsRoutes from './routes/apiCalls.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// MongoDB connection (moved to a function for Vercel serverless)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err; // Let the error handler catch this
  }
};

// Connect on each request for serverless
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/fetch', fetchRoutes);
app.use('/api/stats', statsRoutes);

// Fixed root route
app.get('/', (req, res) => {
  res.json({
    activeStatus: true,
    error: false,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export default app; // Export for Vercel