import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  const options = {
    dbName: 'sample_ecommerce',
  };

  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing in env');
    }

    await mongoose.connect(MONGO_URI, options);

    console.log('Connected to the database.');
  } catch (error) {
    console.error('Error connecting to database: ', error);
    process.exit(1);
  }
}
