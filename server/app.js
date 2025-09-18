import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/authRouter.js';
import userRouter from './src/routes/userRouter.js';
import chatRouter from './src/routes/chatRouter.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Backend working fine ✅');
});
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

// Connect to DB once per cold start
let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("Database connected ✅");
    } catch (err) {
      console.error("DB connection failed:", err);
      res.status(500).json({ message: "Database connection failed" });
      return;
    }
  }
  app(req, res); // handle the request
};

export default handler;
