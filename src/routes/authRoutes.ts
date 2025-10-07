import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import User from '../models/User';

const router = Router();

// Inscription
router.post('/register', register);

// Connexion
router.post('/login', login);

// Profil protégé
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById((req.user as any).userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
