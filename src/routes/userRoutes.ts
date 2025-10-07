import { Router } from 'express';
import { listUsers, createUser } from '../controllers/userController';
import { body, validationResult } from 'express-validator';

const router = Router();
router.get('/users', listUsers);
router.post(
	'/users',
	[
		body('name').notEmpty().withMessage('Le nom est requis'),
		body('email').isEmail().withMessage('Email invalide')
	],
		(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			next();
		},
	createUser
);

export default router;