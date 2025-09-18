import express from 'express';
import cors from 'cors'
import 'dotenv/config.js';
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/authRouter.js';
import userRouter from './src/routes/userRouter.js';
import chatRouter from './src/routes/chatRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://stream-web-chat-app.vercel.app/",
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('backend working fine');
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Backend is running on port : ${PORT}`);
  connectDB();
})


