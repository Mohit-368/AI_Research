import mongoose from 'mongoose';

const connectDatabase = async () => {
  const databaseUrl = process.env.MONGO_URI;

  if (!databaseUrl) {
    throw new Error('MONGO_URI is not defined in the environment');
  }

  await mongoose.connect(databaseUrl);
  console.log('Database connected');
};

export default connectDatabase;