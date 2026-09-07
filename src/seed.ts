import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from './lib/db';
import { User } from './modules/users/user.model';
import mongoose from 'mongoose';

dotenv.config();

const seedAdmin = async (): Promise<void> => {
  await connectDB();

  const email = 'your-email@example.com'; // change this
  const plainPassword = 'ChangeThisPassword123!'; // change this

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await User.create({
    email,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin user created');
  await mongoose.disconnect();
};

seedAdmin();