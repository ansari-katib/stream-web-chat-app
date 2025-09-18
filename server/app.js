import express from 'express';
import cors from 'cors'
import 'dotenv/config.js';
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/authRouter.js';
import userRouter from './src/routes/userRouter.js';
import chatRouter from './src/routes/chatRouter.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('backend working fine ✅');
// });

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);


// **** most important for production :
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/*any", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Backend is running on port : ${PORT}`);
  connectDB();
})
