import express from 'express';
import authRoutes from './routes/authRoutes';
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

// Pages EJS pour inscription et connexion
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));

// Page utilisateurs (HTML stylé, les données viendront du fetch côté front)
app.get('/users', (req, res) => {
  res.render('users');
});

// Routes API
app.use('/', authRoutes);  // POST /register, POST /login, GET /profile
app.use('/', userRoutes);  // GET /api/users, POST /users

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware global d'erreur
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

export default app;