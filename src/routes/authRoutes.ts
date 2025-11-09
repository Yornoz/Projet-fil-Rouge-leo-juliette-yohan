import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import User from '../models/User';

const router = Router();


router.post('/register', register);


router.post('/login', login);


interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}


router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password'); // ne jamais renvoyer le mot de passe
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;