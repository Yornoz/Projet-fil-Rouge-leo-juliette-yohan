import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IOption {
  text: string;
  votes: number;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  user: IUser['_id'];
  options: IOption[];
  createdAt: Date;
}

const optionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  options: { type: [optionSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);