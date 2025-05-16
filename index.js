import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // 👉 add this line

import authRoutes from './routes/auth.js';
import updateRoutes from './routes/update.js';
import fetchRoutes from './routes/fetch.js';
import statsRoutes from './routes/apiCalls.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'https://track-my-growth-frontend.vercel.app/',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/fetch', fetchRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
