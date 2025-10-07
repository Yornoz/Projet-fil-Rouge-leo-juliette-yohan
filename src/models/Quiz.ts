import mongoose, { Schema, Document } from 'mongoose';
import User from './User';

export interface IQuiz extends Document {
  title: string;
  description: string;
  user: mongoose.Types.ObjectId; // créateur du quizz
  createdAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);
