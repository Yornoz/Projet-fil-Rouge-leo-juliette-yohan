import Quiz from '../models/Quiz';
import { Request, Response } from 'express';

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const author = (req as any).user._id; // via authMiddleware
    const { title, description, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'title et questions sont requis.' });
    }
    for (const q of questions) {
      if (!q.text || !Array.isArray(q.choices) || q.choices.length < 2) {
        return res.status(400).json({ error: 'Chaque question doit avoir un texte et >= 2 choix.' });
      }
      if (!q.choices.some((c: any) => c.isCorrect === true)) {
        return res.status(400).json({ error: 'Chaque question doit avoir au moins une bonne réponse.' });
      }
    }

    const quiz = await Quiz.create({ title, description, questions, author });
    res.status(201).json(quiz);
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('author', 'name');
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' });
    res.json(quiz);
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' });

    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: 'Format des réponses invalide.' });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      const goodIdx = q.choices
        .map((c, idx) => (c.isCorrect ? idx : -1))
        .filter(idx => idx !== -1);

      const ans = answers[i];
      if (q.allowMultiple) {
        const sortedAns = Array.isArray(ans) ? [...ans].sort() : [];
        const sortedGood = [...goodIdx].sort();
        if (JSON.stringify(sortedAns) === JSON.stringify(sortedGood)) score++;
      } else {
        if (typeof ans === 'number' && goodIdx.length === 1 && ans === goodIdx[0]) score++;
      }
    });

    res.json({ total: quiz.questions.length, score });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
};