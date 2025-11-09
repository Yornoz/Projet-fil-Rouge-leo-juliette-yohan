import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: any;
}

// Middleware pour routes réservées à l'admin
export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé : réservé à l’administrateur.' });
  }
}

// Middleware pour routes protégées
export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Non autorisé' });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // ✅ corrigé ici
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// Middleware optionnel pour pages publiques
export async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      req.user = null;
      res.locals.user = null;
      return next();
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // ✅ corrigé ici aussi
    req.user = user || null;
    res.locals.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    res.locals.user = null;
    next();
  }
}
