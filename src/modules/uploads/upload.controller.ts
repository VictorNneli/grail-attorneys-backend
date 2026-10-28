import type { Response } from 'express';
import type {UploadApiResponse} from 'cloudinary';
import type { AuthRequest } from '../../middleware/requireAuth';
import { getCloudinaryConfig } from '../../lib/cloudinary';