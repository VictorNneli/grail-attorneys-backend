import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model';
import type { AuthRequest } from '../../middleware/requireAuth';

interface LoginBody {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'Server misconfiguration' });
    return;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
};

interface UpdateAccountBody {
  currentPassword: string;
  newEmail?: string;
  newPassword?: string;
}

export const updateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newEmail, newPassword } = req.body as UpdateAccountBody;

  if (!currentPassword) {
    res.status(400).json({ message: 'Current password is required' });
    return;
  }

  if (!newEmail && !newPassword) {
    res.status(400).json({ message: 'Provide a new email, a new password, or both' });
    return;
  }

  if (newPassword && newPassword.length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters' });
    return;
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    res.status(404).json({ message: 'Account not found' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  if (newEmail && newEmail !== user.email) {
    const taken = await User.findOne({ email: newEmail });
    if (taken) {
      res.status(409).json({ message: 'That email is already in use' });
      return;
    }
    user.email = newEmail;
  }

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  res.json({ message: 'Account updated' });
};