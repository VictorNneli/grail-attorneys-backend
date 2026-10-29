import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from './upload.controller';
import { requireAuth } from '../../middleware/requireAuth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = Router();

router.post(
  '/admin',
  requireAuth,
  (req, res, next) => {
    upload.single('image')(req, res, (err: unknown) => {
      if (err) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Upload failed' });
        return;
      }
      next();
    });
  },
  uploadImage
);

export default router;