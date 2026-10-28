import { Router } from 'express';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from './team.controller';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';

const router = Router();

router.get('/', getTeamMembers);
router.post('/admin', requireAuth, createTeamMember);
router.put('/admin/:id', requireAuth, updateTeamMember);
router.delete('/admin/:id', requireAuth, requireRole('admin'), deleteTeamMember);

export default router;