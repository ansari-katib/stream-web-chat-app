import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn; // Use cached connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        throw err; // Throw error instead of process.exit
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
