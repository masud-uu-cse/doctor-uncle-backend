import mongoose, { Schema, Document } from 'mongoose';

export interface IDemo extends Document {
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DemoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DemoModel = mongoose.model<IDemo>('Demo', DemoSchema);
