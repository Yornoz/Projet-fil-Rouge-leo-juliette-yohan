import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email déjà utilisé' });

    // Crée l'utilisateur 
    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'Utilisateur créé', user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Récupère l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    // Génère le JWT incluant le rôle et le nom
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Renvoie le token, le nom et la redirection
    res.json({ token, name: user.name, redirect: '/' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}