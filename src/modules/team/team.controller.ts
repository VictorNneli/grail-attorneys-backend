import { Request, Response } from 'express';
import { TeamMember } from './team.model';
import { AuthRequest } from '../../middleware/requireAuth';

// PUBLIC: list all team members, ordered
export const getTeamMembers = async (_req: Request, res: Response): Promise<void> => {
  const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
  res.json(members);
};

interface TeamMemberBody {
  name: string;
  title: string;
  bio?: string;
  photo?: string;
  order?: number;
}

// ADMIN: create
export const createTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, title, bio, photo, order } = req.body as TeamMemberBody;

  if (!name || !title) {
    res.status(400).json({ message: 'Name and title are required' });
    return;
  }

  const member = await TeamMember.create({ name, title, bio, photo, order: order ?? 0 });
  res.status(201).json(member);
};

// ADMIN: update
export const updateTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  const updates = req.body as Partial<TeamMemberBody>;

  const member = await TeamMember.findByIdAndUpdate(req.params.id, updates, { new: true });

  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }

  res.json(member);
};

// ADMIN: delete
export const deleteTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) {
    res.status(404).json({ message: 'Team member not found' });
    return;
  }
  res.json({ message: 'Team member deleted' });
};