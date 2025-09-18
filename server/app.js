import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/lib/db.js';
import authRouter from './src/routes/authRouter.js';
import userRouter from './src/routes/userRouter.js';
import chatRouter from './src/routes/chatRouter.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Backend working fine ✅'));
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);

// Connect to MongoDB once
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  try {
    const db = await connectDB(); // Make sure connectDB() returns the connection or a promise
    cachedDb = db;
    console.log('Database connected ✅');
    return db;
  } catch (err) {
    console.error('DB connection failed:', err);
    throw err;
  }
}

// Export Vercel handler
export default async function handler(req, res) {
  try {
    await connectToDatabase(); // ensure DB is connected
    app(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}
