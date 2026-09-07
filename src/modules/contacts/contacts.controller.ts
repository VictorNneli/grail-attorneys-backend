import { Request, Response } from 'express';
import { Message } from './message.model';
import { AuthRequest } from '../../middleware/requireAuth';
import { sendContactNotification } from './mailer';

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// PUBLIC: submit the contact form
export const submitMessage = async (req: Request<{}, {}, ContactBody>, res: Response): Promise<void> => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: 'Name, email, subject, and message are required' });
    return;
  }

  const saved = await Message.create({ name, email, phone, subject, message });

  await sendContactNotification({ name, email, subject });

  res.status(201).json({ message: 'Message received', id: saved._id });
};

// ADMIN: list all messages
export const getAllMessages = async (_req: AuthRequest, res: Response): Promise<void> => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};

// ADMIN: view one message (auto-marks as "read")
export const getMessageById = async (req: AuthRequest, res: Response): Promise<void> => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }

  if (message.status === 'new') {
    message.status = 'read';
    await message.save();
  }

  res.json(message);
};

// ADMIN: update status (e.g. mark as "responded")
export const updateMessageStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body as { status: 'new' | 'read' | 'responded' };

  const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true });

  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }

  res.json(message);
};

// ADMIN (admin role only): delete a message
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404).json({ message: 'Message not found' });
    return;
  }
  res.json({ message: 'Message deleted' });
};