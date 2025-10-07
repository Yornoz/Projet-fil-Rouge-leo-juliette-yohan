import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

// Configurer EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Servir les fichiers statiques
app.use(express.static(__dirname + '/public'));

// Page d'accueil
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

// Page utilisateurs (rendu EJS)
import User from './models/User';
app.get('/users', async (req, res, next) => {
	try {
		const users = await User.find();
		res.render('users', { users });
	} catch (err) {
		next(err);
	}
});


import authRoutes from './routes/authRoutes';
app.use('/', authRoutes);
app.use('/', userRoutes);

// Middleware 404
app.use((req, res, next) => {
	res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware global d'erreur
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err);
	res.status(500).json({ error: 'Erreur serveur' });
});

export default app;