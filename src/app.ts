import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import Quiz from './models/Quiz';

const app = express();
app.use(express.json());

// Configurer EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Servir les fichiers statiques
app.use(express.static(__dirname + '/public'));

// Routes API
app.use('/', authRoutes);  // POST /register, POST /login, GET /profile
app.use('/', userRoutes);  // GET /api/users, POST /users, DELETE /api/users/:id
app.use('/', quizRoutes);  // Toutes les routes pour les quizz

// Pages EJS
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/users', (req, res) => res.render('users'));
app.get('/mesquiz', (req, res) => res.render('mesQuiz'));
app.get('/lesquiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('author', 'name').sort({ createdAt: -1 });
    res.render('LesQuiz', { quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});
app.get('/creerquiz', (req, res) => res.render('CreerQuiz'));

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
