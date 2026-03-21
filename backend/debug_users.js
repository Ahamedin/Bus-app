import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGO_URI;


async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const users = await User.find({ tripActive: true });
    console.log('--- ACTIVE USERS ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
