<<<<<<< Updated upstream
# projet
projet quizz
=======
# TP Mongoose CRUD

Projet de base pour le TP d'intégration MongoDB avec Express et TypeScript.

## Installation
1. npm install
2. npm run dev

Par défaut, le projet tente de se connecter à mongodb://localhost:27017/quizApp.
Modifiez src/config/database.ts si nécessaire.
README – Fonctionnement des routes de l’API
Ce projet Express/Mongoose propose plusieurs routes pour la gestion des utilisateurs, de l’authentification et des quizz.
Voici un guide pour comprendre le fonctionnement de chaque route.


## Authentification (authRoutes.ts)
POST /register

Inscription d’un nouvel utilisateur.
Corps attendu :

{ "name": "Alice", "email": "alice@mail.com", "password": "secret" }

POST /login

Connexion utilisateur.
Retourne un token JWT :

{ "token": "xxxxx.yyyyy.zzzzz" }

GET /profile

Retourne les informations de l’utilisateur connecté.
Nécessite le header :

Authorization: Bearer <token>

## Utilisateurs (userRoutes.ts)
GET /api/users

Liste des utilisateurs — réservé à l’admin.
Utilise authMiddleware et roleMiddleware('admin').

POST /api/users

Création d’un utilisateur (par admin ou inscription directe).
Validation via express-validator.

## Quizz (quizRoutes.ts)
POST /api/quizzes

Crée un quizz complet. (auth requis)
Exemple de corps :

{
  "title": "Culture générale",
  "description": "Testez vos connaissances",
  "questions": [
    {
      "text": "Quelle est la capitale de l'Italie ?",
      "allowMultiple": false,
      "choices": [
        { "text": "Rome", "isCorrect": true },
        { "text": "Milan", "isCorrect": false },
        { "text": "Venise", "isCorrect": false }
      ]
    }
  ]
}

GET /api/quizzes

Retourne la liste des quizz avec leur auteur.

GET /api/quizzes/:id

Retourne un quizz complet par son ID.

POST /api/quizzes/:id/submit

Soumet les réponses et renvoie :

{ "score": 3, "total": 5 }


Accessible sans authentification.

## Pages Front EJS

## CreerQuizz.ejs

Interface moderne et responsive :

Ajout/suppression dynamique de questions et de choix.

Sélection des bonnes réponses (checkbox).

Validation automatique avant envoi.

Affichage de messages de succès/erreur.

Design Bootstrap 5 homogène avec la page de jeu.

## quiz.ejs

Page de jeu pour répondre à un quizz :

Affichage dynamique des questions.

Sélection simple ou multiple.

Envoi AJAX.

Affichage immédiat du score sans rechargement :

✅ Score : 4 / 5

## LesQuizz.ejs

Liste des quizz disponibles avec auteur et bouton Jouer :

<a class="btn btn-primary mt-3" href="/quizzes/<%= quiz._id %>">Jouer</a>

## Middlewares

authMiddleware → Vérifie la présence et la validité du token JWT.

roleMiddleware(role) → Vérifie le rôle utilisateur (admin, user...).
>>>>>>> Stashed changes
