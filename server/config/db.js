import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🟢 MongoDB Connected Successfully");
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error.message);

    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
