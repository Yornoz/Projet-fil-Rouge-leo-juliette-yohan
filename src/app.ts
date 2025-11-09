import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import Quiz from './models/Quiz';
import User from './models/User';
import { isAdmin, authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ important

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', quizRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/mesquiz', (req, res) => res.render('mesQuiz'));
app.get('/users', (req, res) => res.render('users'));
app.get('/creerquiz', (req, res) => res.render('CreerQuiz'));

app.get('/lesquiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('author', 'name').sort({ createdAt: -1 });
    res.render('LesQuiz', { quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Nouvelle route protégée
app.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.render('users');
});

app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

export default app;
