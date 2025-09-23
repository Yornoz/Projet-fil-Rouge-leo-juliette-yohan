import { Router } from 'express';
import { listerUtilisateurs, trouverUtilisateurParId, creerUtilisateur } from '../controllers/utilisateurController';

const router = Router();

router.get('/utilisateurs', listerUtilisateurs);
router.get('/utilisateur/:id', trouverUtilisateurParId);
router.post('/utilisateurs', creerUtilisateur); // bonus

export default router;
