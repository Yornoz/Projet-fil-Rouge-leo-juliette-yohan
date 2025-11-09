import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé : réservé aux administrateurs' });
    }

    next();
  };
}