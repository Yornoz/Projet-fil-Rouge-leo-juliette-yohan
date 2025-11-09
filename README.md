🧠 QuISEN — Projet Étudiant (Juliette, Yohan, Léo) 📘 Description du projet

Ce projeet est une application web de quiz interactif développée en TypeScript avec le framework Express.js. Elle permet à des utilisateurs de :

créer un compte et se connecter,

consulter les quizss disponibles,

répondre à des quizs et consulter leur score,

créer leurs propres quizs,

gérer leurs quiz via une interface utilisateur simple.

Ce projet a été réalisée dans le cadre d’un projet étudiiant en 2ᵉ année, et vise à illustrer les notions de :

architecture MVC (Modèle / Vue / Contrôleur),

gestion d’authentification et autorisation,

utilisation d’une base de données,

séparation claire des responsabilités dans un serveur Express moderne.

🏗️ Architecture du projet src/ │ ├── app.ts # Configuration principale de l’application Express ├── server.ts # Point d’entrée du serveur │ ├── config/ │ └── database.ts # Connexion à la base de données │ ├── controllers/ # Logique métier de l’application │ ├── authController.ts # Inscription, connexion, déconnexion │ ├── quizController.ts # Gestion des quiz (CRUD) │ └── userController.ts # Gestion des utilisateurs │ ├── middleware/ # Middleware Express pour la sécurité │ ├── authMiddleware.ts # Vérifie la présence d’un token ou d’une session │ └── roleMiddleware.ts # Vérifie le rôle de l’utilisateur (admin, user, etc.) │ ├── models/ # Modèles de données (ORM ou schémas) │ ├── Quiz.ts # Schéma ou classe représentant un Quiz │ └── User.ts # Schéma ou classe représentant un Utilisateur │ ├── public/ # Fichiers statiques accessibles par le client │ ├── index.html │ ├── style.css │ └── Photos/ │ ├── Quizz1.jpg │ ├── Quizz2.png │ └── Quizz3.jpg │ ├── routes/ # Définition des routes Express │ ├── authRoutes.ts # Routes d’authentification │ ├── quizRoutes.ts # Routes pour les quiz │ ├── userRoutes.ts # Routes utilisateurs │ └── pages.ts # Routes pour le rendu des pages EJS │ └── views/ # Templates EJS pour le rendu côté serveur ├── login.ejs ├── register.ejs ├── quiz.ejs ├── CreerQuizz.ejs ├── LesQuizz.ejs ├── mesQuizz.ejs └── users.ejs

⚙️ Fonctionnement général 🔸 Lancement du serveur

Le point d’entrée server.ts démarre le serveur Express.

app.ts configure :

les middlewares généraux (body-parser, cookies, sessions…),

la connexion à la base de données (via config/database.ts),

les routes (routes/*.ts),

et le moteur de rendu EJS.

Une fois lancé, le serveur est accessible sur :

http://localhost:3000

🌐 Système de routes 🔐 Routes d’authentification (routes/authRoutes.ts) Méthode Description GET /login Affiche la page de connexion POST /login Authentifie un utilisateur GET/register Affiche la page d’inscription POST/register Crée un nouvel utilisateur

🧩 Routes Quiz (routes/quizRoutes.ts) Méthode Description GET/quiz Liste les quiz disponibles GET/quiz/:id Joue un quiz spécifique POST/quiz Crée un nouveau quiz POST/quiz/:id/delete Supprime un quiz POST/quiz/:id/update Met à jour un quiz

👤 Routes Utilisateurs (routes/userRoutes.ts) Méthode Description GET /users Liste des utilisateurs (admin) GET /users/:id Affiche les infos d’un utilisateur POST/users/:id/delete Supprime un utilisateur

🖼️ Pages (routes/pages.ts)

Ce fichier gère les rendus EJS :

/ redirige vers /login ou /quiz

/mesQuizz → affiche les quiz créés par l’utilisateur connecté

/CreerQuizz → page de création de quiz

/LesQuizz → liste générale des quiz disponibles

🔒 Gestion de la sécurité

Le projet utilise deux couches de sécurité principales :

authMiddleware.ts
Vérifie si l’utilisateur est connecté (présence d’un token).

Redirige vers /login s’il ne l’est pas.

Peut décoder un JWT ou utiliser une session Express, selon la configuration.

roleMiddleware.ts
Vérifie si l’utilisateur possède un rôle spécifique (par ex. admin).

Bloque l’accès à certaines routes si le rôle est insuffisant.

Gestion des mots de passe
Les mots de passe sont hachés avant stockage (via bcrypt).

En cas de connexion, le mot de passe fourni est comparé avec le hash en base.

🧩 Modèles de données 🧍‍♂️ User (models/User.ts)

Contient :

{ id: number, username: string, email: string, password: string, // hashé role: string // 'user' | 'admin' }

🧠 Quiz (models/Quiz.ts)

Représente un quiz créé par un utilisateur :

{ id: number, title: string, questions: createdBy: number // id de l’utilisateur }

🧰 Installation et exécution 1️ Installer les dépendances : npm install

2 Lancer le serveur : npm run dev

Ajout d'un pannel admin visible uniquement si l'utilisateur est un admin:
Bouton pannel admin sur la page d'acueil qui mène via une route sécurisée, à une page qui permet aux admins de modifier/supprimer des quizs et supprimer des utilisateurs.

Finalement, les mots de passes pour tester les comptes en tant que admin et users: 
Admin - admin@gmail.com - MDP= 123456 (visible en code dur sur app.ts ligne 15).
A vous de tester de créer un utilisateur classique pour tester la fonction d'incscription et de connexion, ainsi que rôle.
Quizs à tester déjà crée: Culture Générale et Foot (malhueresement ces deux quizs étant déjà dans la base de données, ils ne sont pas modifiable via le pannel admin. Pour effectuer un test avec le pannel admin, cela fonctionne uniquement avec tous les nouveaux quizs ajoutés)


Merci en espérant que ce READ ME vous aura aidé.
