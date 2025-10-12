// routes/quizRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import Quiz from '../models/Quiz';
import { createQuiz, getQuizById, submitQuiz } from '../controllers/quizController';

const router = Router();

/**
 * GET /api/quizzes
 * Liste tous les quizz
 */
router.get('/api/quizzes', async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().select('-__v').populate('author', 'name');
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quizzes
 * Crée un quizz (auth requis)
 * Body attendu: { title, description?, questions: [{ text, allowMultiple?, choices:[{text,isCorrect}] }] }
 */
router.post('/api/quizzes', authMiddleware, createQuiz);

/**
 * GET /api/quizzes/:id
 * Récupère un quizz par ID
 */
router.get('/api/quizzes/:id', getQuizById);

/**
 * PUT /api/quizzes/:id
 * Met à jour un quizz (auth requis; l’auteur ou un admin idéalement)
 */
router.put('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quizz introuvable' });

    // (Optionnel) Vérifier l’auteur: if (quiz.author.toString() !== (req as any).user._id) return res.status(403).json({error:'Interdit'});
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

/**
 * DELETE /api/quizzes/:id
 * Supprime un quizz (auth requis; l’auteur ou un admin idéalement)
 */
router.delete('/api/quizzes/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quizz introuvable' });

    // (Optionnel) Vérifier l’auteur: if (quiz.author.toString() !== (req as any).user._id) return res.status(403).json({error:'Interdit'});
    await quiz.deleteOne();
    res.json({ message: 'Quizz supprimé' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quizzes/:id/submit
 * Soumet les réponses et renvoie { score, total }
 * Body attendu: { answers: (number | number[])[] }
 */
//router.post('/api/quizzes/:id/submit', authMiddleware, submitQuiz);  //Avec authentification
router.post('/api/quizzes/:id/submit', submitQuiz); //Sans authentification

/**
 * GET /quizzes/:id
 * Route de page (EJS) pour jouer le quizz
 * Rendra la vue 'quiz.ejs' avec { quiz }
 */
router.get('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('author', 'name');
    if (!quiz) return res.status(404).send('Quizz introuvable');
    res.render('quiz', { quiz });
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

export default router;
