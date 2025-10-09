import { Router, Request, Response } from 'express';
import Quiz from '../models/Quiz';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Interface locale identique à celle de authMiddleware
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}
router.post('/api/quizzes/:quizId/vote', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { optionIndex } = req.body;
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quizz non trouvé' });

    if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= quiz.options.length) {
      return res.status(400).json({ error: 'Option invalide' });
    }

    quiz.options[optionIndex].votes += 1;
    await quiz.save();

    res.json({ success: true, quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// Créer un nouveau quizz (auth requis)
router.post('/api/quizzes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, options } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      options,
      user: req.user._id
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les quizz
router.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;