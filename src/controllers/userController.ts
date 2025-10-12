import { Request, Response } from 'express';
import User from '../models/User';

export async function listUsers(req: Request, res: Response) {
  const users = await User.find().select('-password'); // Ne jamais renvoyer le password
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Créer l'utilisateur (le hash est fait par le middleware)
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'Utilisateur créé', user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}