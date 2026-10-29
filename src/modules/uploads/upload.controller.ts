import type { Response } from 'express';
import type { UploadApiResponse } from 'cloudinary';
import type { AuthRequest } from '../../middleware/requireAuth';
import { getCloudinaryConfig } from '../../lib/cloudinary';

export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'No image file provided' });
    return;
  }

  const cloudinary = getCloudinaryConfig();

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'grail-attorneys', resource_type: 'image' },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error('Upload failed'));
            return;
          }
          resolve(uploaded);
        }
      );
      stream.end(file.buffer);
    });

    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};