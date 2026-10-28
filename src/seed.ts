import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from './lib/db';
import { User } from './modules/users/user.model';

dotenv.config();

const seedAdmin = async (): Promise<void> => {
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  await User.create({ email, password: hashedPassword, role: 'admin' });

  console.log('Admin user created');
  await mongoose.disconnect();
};

seedAdmin();