import { Request, Response, NextFunction } from 'express';

// Vérifie que l'utilisateur a le rôle nécessaire
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // req.user est défini par authMiddleware
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    next();
  };
}
