import { Router, Request, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware, isAdmin } from '../middleware/authMiddleware';
import Quiz from '../models/Quiz';
import { createQuiz, getQuizById, submitQuiz } from '../controllers/quizController';

const router = Router();

/* =============================
   🔹 ROUTES PUBLIQUES
============================= */

// Liste de tous les quizz visibles publiquement
router.get('/api/quizzes', optionalAuthMiddleware, async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().select('-__v').populate('author', 'name');
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Pages de quizz "fixes"
router.get('/quizzes/culture-generale', (_req: Request, res: Response) => {
  res.render('quizCultureGenerale');
});

router.get('/quizzes/football', (_req: Request, res: Response) => {
  res.render('quizFootball');
});

// Détails d’un quizz (JSON)
router.get('/api/quizzes/:id', optionalAuthMiddleware, getQuizById);

// Soumission des réponses à un quizz
router.post('/api/quizzes/:id/submit', submitQuiz);

// Page de lecture du quizz (EJS)
router.get('/quizzes/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('author', 'name');
    if (!quiz) return res.status(404).send('Quiz introuvable');
    res.render('quiz', { quiz });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});


/* =============================
   🔹 ROUTES PROTÉGÉES (user connecté)
============================= */

// Création d’un nouveau quizz
router.post('/api/quizzes', authMiddleware, createQuiz);

// Modification d’un quizz existant
router.put('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' });

    const updatable = ['title', 'description', 'questions', 'published'] as const;
    for (const key of updatable) {
      if (key in req.body) (quiz as any)[key] = (req.body as any)[key];
    }

    await quiz.save();
    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Suppression d’un quizz
router.delete('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' });

    await quiz.deleteOne();
    res.json({ message: 'Quizz supprimé' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


/* =============================
   🔹 ROUTE ADMIN (gestion complète)
============================= */

router.get('/api/admin/quizzes', authMiddleware, isAdmin, async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
