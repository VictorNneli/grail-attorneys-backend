import { Response } from 'express';
import { Post } from './post.model';
import { AuthRequest } from '../../middleware/requireAuth';
import { Request } from 'express';

// Turns "My First Post!" into "my-first-post"
const slugify = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// PUBLIC: list published posts only
export const getPublishedPosts = async (_req: Request, res: Response): Promise<void> => {
  const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 });
  res.json(posts);
};

// PUBLIC: single published post by slug
export const getPublishedPostBySlug = async (req: Request, res: Response): Promise<void> => {
  const post = await Post.findOne({ slug: req.params.slug, status: 'published' });
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  res.json(post);
};

// ADMIN: list all posts (draft + published)
export const getAllPosts = async (_req: AuthRequest, res: Response): Promise<void> => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

interface CreatePostBody {
  title: string;
  body: string;
  coverImage?: string;
  status?: 'draft' | 'published';
}

// ADMIN: create a post
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, body, coverImage, status } = req.body as CreatePostBody;

  if (!title || !body) {
    res.status(400).json({ message: 'Title and body are required' });
    return;
  }

  const post = await Post.create({
    title,
    body,
    coverImage,
    status: status ?? 'draft',
    slug: slugify(title),
    author: req.user?.id
  });

  res.status(201).json(post);
};

// ADMIN: update a post
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const updates = req.body as Partial<CreatePostBody>;

  if (updates.title) {
    (updates as Partial<CreatePostBody> & { slug?: string }).slug = slugify(updates.title);
  }

  const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });

  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }

  res.json(post);
};

// ADMIN: delete a post
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
    return;
  }
  res.json({ message: 'Post deleted' });
};