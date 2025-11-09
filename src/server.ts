import app from './app';
import { connectDB } from './config/database';
import Quiz from './models/Quiz';
import User from './models/User';

const PORT = 3000;

const startServer = async () => {
  await connectDB();

  // 🧠 Création de données de test (si la base est vide)
  const userCount = await User.countDocuments();
  const quizCount = await Quiz.countDocuments();

  if (userCount === 0) {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
    });
    console.log('👤 Utilisateur de test créé :', user.email);
  }

  if (quizCount === 0) {
    const user = await User.findOne();
    await Quiz.create([
      {
        title: 'Quiz sur JavaScript',
        questions: [
          {
            question: 'Quel mot-clé permet de déclarer une variable constante ?',
            options: ['let', 'const', 'var', 'static'],
            answer: 'const',
          },
        ],
        author: user?._id,
      },
      {
        title: 'Quiz sur HTML',
        questions: [
          {
            question: 'Que signifie HTML ?',
            options: [
              'HyperText Markup Language',
              'HighText Machine Language',
              'HyperTool Multi Language',
              'Aucune des réponses',
            ],
            answer: 'HyperText Markup Language',
          },
        ],
        author: user?._id,
      },
    ]);
    console.log('🧩 Quiz de test ajoutés !');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
};

startServer();
