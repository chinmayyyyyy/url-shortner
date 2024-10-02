import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGOURI || 'mongodb://localhost:27017/DatabaseShortener';
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
    } else {
      console.error('Error connecting to MongoDB:', error);
    }
    process.exit(1); 
  }
};

export default connectDB;
