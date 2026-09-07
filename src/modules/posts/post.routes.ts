import { Router } from 'express';
import {
  getPublishedPosts,
  getPublishedPostBySlug,
  getAllPosts,
  createPost,
  updatePost,
  deletePost
} from './post.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const router = Router();

// Public routes
router.get('/', getPublishedPosts);
router.get('/:slug', getPublishedPostBySlug);

// Admin routes
router.get('/admin/all', requireAuth, getAllPosts);
router.post('/admin', requireAuth, createPost);
router.put('/admin/:id', requireAuth, updatePost);
router.delete('/admin/:id', requireAuth, requireRole('admin'), deletePost);

export default router;