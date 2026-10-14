import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Database connection error: MONGODB_URI is not configured.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "mediconnect",
    });
    console.log(`Database Connected (${mongoose.connection.name})`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
