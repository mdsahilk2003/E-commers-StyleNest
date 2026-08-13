import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://kausharkhatoon445_db_user:2rvCQ7JXfaX4pAKL@cluster0.sxmljku.mongodb.net/setia-collection?retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.MONGODB_URI || DEFAULT_URI;
    const conn = await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
  }
};

export default connectDB;
