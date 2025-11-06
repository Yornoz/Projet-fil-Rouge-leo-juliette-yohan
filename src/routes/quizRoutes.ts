import { Router, Request, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware';
import Quiz from '../models/Quiz';
import { createQuiz, getQuizById, submitQuiz } from '../controllers/quizController';

const router = Router();

// --- Routes publiques ---
router.get('/api/quizzes', optionalAuthMiddleware, async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().select('-__v').populate('author', 'name');
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/quizzes/:id', optionalAuthMiddleware, getQuizById);
router.post('/api/quizzes/:id/submit', submitQuiz);
router.get('/quizzes/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('author', 'name');
    if (!quiz) return res.status(404).send('Quizz introuvable');
    res.render('quiz', { quiz });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

// --- Routes protégées ---
router.post('/api/quizzes', authMiddleware, createQuiz);

router.put('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quizz introuvable' });

    const updatable = ['title', 'description', 'questions', 'published'] as const;
    for (const k of updatable) {
      if (k in req.body) (quiz as any)[k] = (req.body as any)[k];
    }
    await quiz.save();
    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quizz introuvable' });

    await quiz.deleteOne();
    res.json({ message: 'Quizz supprimé' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
