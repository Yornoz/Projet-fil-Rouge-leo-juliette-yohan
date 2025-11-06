import { Router, Request, Response, NextFunction } from 'express';
import { listUsers, createUser } from '../controllers/userController';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// --- Route protégée admin ---
router.get('/api/users', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    res.set('Cache-Control', 'no-store');
    await listUsers(req, res);
  } catch (err) {
    console.error('Erreur dans /api/users:', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// --- Route publique (inscription) ---
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

export default router;
