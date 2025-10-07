import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(__dirname + '/public'));

// Page d'accueil
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

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