import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';

import authRoutes from './modules/auth/auth.routes';
import postRoutes from './modules/posts/post.routes';
import contactRoutes from './modules/contacts/contacts.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/contact', contactRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Grail Attorneys API is running' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();