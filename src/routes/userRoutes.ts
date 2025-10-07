import { Router, Request, Response, NextFunction } from 'express';
import { listUsers, createUser } from '../controllers/userController';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Interface locale pour TypeScript pour accéder à req.user
interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

router.get('/api/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    await listUsers(req, res);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


// Route POST /users pour créer un utilisateur (inscription ou par admin)
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
    next(); // correction : TS sait maintenant que next est de type NextFunction
  },
  createUser
);

export default router;
