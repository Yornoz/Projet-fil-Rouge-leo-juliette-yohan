import { Router, Request, Response } from 'express';
import Quiz from '../models/Quiz';
import { authMiddleware } from '../middleware/authMiddleware';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

const router = Router();

// POST /api/quizzes : créer un quizz
router.post('/api/quizzes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis' });
    }

    const newQuiz = await Quiz.create({
      title,
      description,
      user: req.user?._id
    });

    res.status(201).json(newQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la création du quizz' });
  }
});

export default router;
