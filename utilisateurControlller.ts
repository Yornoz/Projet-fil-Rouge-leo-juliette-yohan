import { Request, Response } from 'express';
import { Utilisateur, utilisateurs } from '../models/Utilisateur';

export const listerUtilisateurs = (req: Request, res: Response) => {
  res.json(utilisateurs);
};

export const trouverUtilisateurParId = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = utilisateurs.find(u => u.id === id);
  if (!user) return res.status(404).json({ erreur: 'Utilisateur introuvable' });
  res.json(user);
};

export const creerUtilisateur = (req: Request, res: Response) => {
  const { nom, email } = req.body as { nom?: string; email?: string };
  if (!nom || !email) return res.status(400).json({ erreur: 'Nom et email requis' });
  const id = Math.max(0, ...utilisateurs.map(u => u.id)) + 1;
  const nouveau = new Utilisateur(id, nom, email);
  utilisateurs.push(nouveau);
  res.status(201).json(nouveau);
};
