import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import Quiz from './models/Quiz';
import User from './models/User';
import { isAdmin, authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(express.json());

// --- Config EJS ---
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// --- Fichiers statiques ---
app.use(express.static(__dirname + '/public'));

// --- Routes API ---
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', quizRoutes);

// --- Pages ---
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));
app.get('/mesquiz', (req, res) => res.render('mesQuiz'));
app.get('/creerquiz', (req, res) => res.render('CreerQuiz'));

// 🔹 Page Les Quiz
app.get('/lesquiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('author', 'name').sort({ createdAt: -1 });
    res.render('LesQuiz', { quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// 🔹 Panneau admin (users.ejs)
app.get('/users', authMiddleware, isAdmin, (req, res) => {
  res.render('users'); // C’est ton panneau admin maintenant
});

// --- Insertion auto de quiz par défaut ---
async function insertDefaultQuizzes() {
  try {
    const existing = await Quiz.countDocuments();
    if (existing > 0) return;

    // Vérifie admin
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
      });
      console.log('👤 Utilisateur admin créé');
    }

    // Quiz de base
    const defaultQuizzes = [
      {
        title: 'Culture Générale',
        description: 'Un quiz pour tester ta culture générale',
        author: admin._id,
        questions: [
          {
            text: 'Quelle est la capitale du Canada ?',
            choices: [
              { text: 'Toronto', isCorrect: false },
              { text: 'Ottawa', isCorrect: true },
              { text: 'Vancouver', isCorrect: false },
            ],
          },
          {
            text: 'Combien de continents sur Terre ?',
            choices: [
              { text: '5', isCorrect: false },
              { text: '6', isCorrect: false },
              { text: '7', isCorrect: true },
            ],
          },
        ],
      },
      {
        title: 'Football',
        description: 'Test tes connaissances sur le football ⚽',
        author: admin._id,
        questions: [
          {
            text: 'Quel club a remporté la Ligue des Champions 2023 ?',
            choices: [
              { text: 'Manchester City', isCorrect: true },
              { text: 'Real Madrid', isCorrect: false },
              { text: 'PSG', isCorrect: false },
            ],
          },
          {
            text: 'Quel joueur a remporté le Ballon d’Or 2023 ?',
            choices: [
              { text: 'Lionel Messi', isCorrect: true },
              { text: 'Erling Haaland', isCorrect: false },
              { text: 'Kylian Mbappé', isCorrect: false },
            ],
          },
        ],
      },
    ];

    await Quiz.insertMany(defaultQuizzes);
    console.log('✅ Quiz par défaut ajoutés avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de l’insertion des quiz par défaut :', err);
  }
}
insertDefaultQuizzes();

// --- Middleware 404 ---
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));

// --- Middleware global d'erreur ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

export default app;
