import mongoose from 'mongoose'

export default async function connect() {
  mongoose.connection.on('connected', () => console.log('DB connected'))
  mongoose.connection.on('error', (error) => console.error('DB Error', error))

  try {
    await mongoose.connect(process.env.MONGODB_DB);
    console.log('MongoDB connected successfully');
  } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);  // Exit because the app can't function without the DB
  }
}