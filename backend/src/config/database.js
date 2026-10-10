import mongoose from 'mongoose';

export default async function connectDatabase() {
  const databaseUrl = process.env.MONGO_URI;
  if (!databaseUrl) throw new Error('MONGO_URI is not defined in the environment');
  await mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 10_000 });
  console.log('Database connected');
}
