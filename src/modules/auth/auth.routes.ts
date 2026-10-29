import { Router } from 'express';
import { login, updateAccount } from './auth.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

router.post('/login', login);
router.put('/account', requireAuth, updateAccount);

export default router;