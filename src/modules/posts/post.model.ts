import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  coverImage?: string;
  body: string;
  status: 'draft' | 'published';
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String },
    body: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);