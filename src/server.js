// app.js - Call connectDB before starting server
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/user.routes/route.js';
import gameRoutes from './routes/gameRoutes.js';
import errorHandler from './middlewares/errormiddleware.js';

const app = express();
const PORT = process.env.PORT || 6001;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/user' , userRouter)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use(errorHandler)
// ✅ Connect to DB first, then start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;