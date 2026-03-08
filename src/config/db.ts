import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/notificationSystem";
    console.log("mongoURI",mongoURI);
    if (!mongoURI) {
      throw new Error("MONGO_URI is not present in env file");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Issue in connection with db");
    process.exit(1);
  }
};
