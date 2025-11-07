import { Router, Request, Response, NextFunction } from 'express';
import { listUsers, createUser } from '../controllers/userController';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import User from '../models/User';

const router = Router();

// --- Route protégée admin pour lister tous les utilisateurs ---
router.get('/api/users', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store');
    await listUsers(req, res);
  } catch (err) {
    console.error('Erreur dans /api/users:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Route publique pour créer un nouvel utilisateur ---
router.post(
  '/users',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide')
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createUser
);

// --- Route protégée admin pour supprimer un utilisateur ---
router.delete('/api/users/:id', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err: any) {
    console.error('Erreur lors de la suppression de l’utilisateur:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
