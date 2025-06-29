import express from 'express';
import cors from 'cors'
import 'dotenv/config.js';
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000 ;

app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('backend working fine');
});

app.listen(PORT , () => {
    console.log(`Backend is running on port : ${PORT}`);
    connectDB();
})


