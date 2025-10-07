import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/quizApp');
    console.log('Connexion MongoDB réussie');
  } catch (err) {
    console.error('Erreur de connexion :', err);
    process.exit(1);
  }
}