import { Router } from 'express';
import {
  submitMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
} from './contacts.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const router = Router();

// Public route
router.post('/', submitMessage);

// Admin routes
router.get('/admin', requireAuth, getAllMessages);
router.get('/admin/:id', requireAuth, getMessageById);
router.put('/admin/:id', requireAuth, updateMessageStatus);
router.delete('/admin/:id', requireAuth, requireRole('admin'), deleteMessage);

export default router;