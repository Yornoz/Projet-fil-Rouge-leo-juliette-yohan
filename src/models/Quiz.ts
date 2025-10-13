import { Schema, model, Types } from 'mongoose';

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  choices: Choice[]; // >= 2, au moins une correcte
  allowMultiple?: boolean; // optionnel si vous voulez du multi-réponses
}

export interface Quiz {
  title: string;
  description?: string;
  questions: Question[];
  author: Types.ObjectId;
  published?: boolean;
}

const ChoiceSchema = new Schema<Choice>({
  text: { type: String, required: true, trim: true },
  isCorrect: { type: Boolean, required: true },
});

const QuestionSchema = new Schema<Question>({
  text: { type: String, required: true, trim: true },
  choices: {
    type: [ChoiceSchema],
    validate: [
      (v: Choice[]) => v.length >= 2,
      'Chaque question doit avoir au moins 2 choix.',
    ],
  },
  allowMultiple: { type: Boolean, default: false },
});

const QuizSchema = new Schema<Quiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    questions: {
      type: [QuestionSchema],
      validate: [
        (v: Question[]) => v.length >= 1,
        'Le quizz doit contenir au moins 1 question.',
      ],
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Guard: au moins une bonne réponse par question
QuizSchema.path('questions').validate((questions: Question[]) => {
  return questions.every(q => q.choices.some(c => c.isCorrect));
}, 'Chaque question doit avoir au moins une réponse correcte.');

export default model<Quiz>('Quiz', QuizSchema);