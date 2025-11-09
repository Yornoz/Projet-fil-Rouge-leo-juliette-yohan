import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// ✅ Crée un token JWT
const createToken = (id: string, name: string, role: string) => {
  return jwt.sign({ 'id': id, 'name': name, 'role': role }, JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Enregistrement
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email déjà utilisé' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash });

    res.status(201).json({ message: 'Inscription réussie ', user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Connexion
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mot de passe incorrect ' });

    const token = createToken(user.id.toString(), user.name, user.role);

    // 🔹 Définir le cookie HTTP
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Déconnexion
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
};
