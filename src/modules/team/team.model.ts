import { Schema, model, Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  title: string;
  bio?: string;
  photo?: string;
  order: number;
  createdAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String },
    photo: { type: String },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const TeamMember = model<ITeamMember>('TeamMember', teamMemberSchema);