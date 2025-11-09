# Application de Quiz (tp-mongoose-crud)

Ceci est une application web de quiz construite avec la stack MERN (MongoDB, Express.js, Node.js) et écrite en TypeScript. Elle permet aux utilisateurs de s'inscrire, de se connecter, de créer des quiz et de répondre aux quiz créés par d'autres utilisateurs.

## Fonctionnalités

*   **Authentification des utilisateurs**: Système d'inscription et de connexion sécurisé utilisant JWT et bcrypt.
*   **Gestion des Quiz**: Les utilisateurs authentifiés peuvent créer leurs propres quiz avec plusieurs questions.
*   **Répondre aux Quiz**: Les utilisateurs peuvent parcourir et répondre aux quiz disponibles sur la plateforme.
*   **Accès basé sur les rôles**: Un middleware peut être implémenté pour gérer différents rôles d'utilisateurs (par exemple, admin, utilisateur).

## Technologies Utilisées

*   **Backend**: Node.js, Express.js, TypeScript
*   **Base de données**: MongoDB avec Mongoose ODM
*   **Moteur de template**: EJS
*   **Authentification**: JSON Web Tokens (JWT), bcrypt
*   **Validation**: express-validator
*   **Développement**: ts-node

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre système :
*   [Node.js](https://nodejs.org/) (qui inclut npm)
*   [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/Yornoz/projet.git
    cd projet
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Configuration de l'environnement :**
    Créez un fichier `.env` à la racine du projet et ajoutez votre chaîne de connexion à la base de données et votre secret JWT.
    ```
    MONGO_URI=votre_chaine_de_connexion_mongodb
    JWT_SECRET=votre_secret_jwt
    ```

## Utilisation

Pour lancer l'application en mode développement, utilisez la commande suivante. Le serveur redémarrera automatiquement lorsque vous modifierez le code.

```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:3000` (ou le port spécifié dans votre configuration).

## Structure du Projet

```
/src
|-- /config
|   |-- database.ts       # Connexion à la base de données
|-- /controllers
|   |-- authController.ts   # Logique d'inscription et de connexion des utilisateurs
|   |-- quizController.ts   # Logique de création et de récupération des quiz
|   |-- userController.ts   # Logique de gestion des utilisateurs
|-- /middleware
|   |-- authMiddleware.ts   # Middleware d'authentification JWT
|   |-- roleMiddleware.ts   # Contrôle d'accès basé sur les rôles
|-- /models
|   |-- Quiz.ts             # Modèle Mongoose pour les Quiz
|   |-- User.ts             # Modèle Mongoose pour les Utilisateurs
|-- /public
|   |-- /css                # Feuilles de style CSS
|   |-- /img                # Ressources images
|-- /routes
|   |-- authRoutes.ts       # Routes d'authentification
|   |-- quizRoutes.ts       # Routes relatives aux quiz
|   |-- userRoutes.ts       # Routes relatives aux utilisateurs
|-- /views
|   |-- *.ejs               # Fichiers de template EJS
|-- app.ts                  # Configuration de l'application Express
|-- server.ts               # Point d'entrée du serveur

## Architecture et Flux de Données

L'application suit une architecture Modèle-Vue-Contrôleur (MVC) classique pour organiser le code et séparer les préoccupations.

Voici le déroulement typique d'une requête HTTP :

1.  **Point d'entrée (`server.ts`)** : Le serveur est lancé et écoute les connexions entrantes sur un port défini. Ce fichier importe l'instance de l'application Express depuis `app.ts`.

2.  **Configuration de l'application (`app.ts`)** : Ce fichier est le cœur de l'application Express. Il configure les middlewares essentiels (comme `express.json()` pour parser le corps des requêtes, `cookie-parser`), définit le moteur de vues (EJS), sert les fichiers statiques (CSS, images) depuis le dossier `/public`, et monte les routeurs.

3.  **Routage (`/routes`)** : Lorsqu'une requête arrive, `app.ts` la transmet au routeur correspondant (par exemple, `quizRoutes.ts` pour une requête vers `/quiz`). Le routeur associe une URL et une méthode HTTP (GET, POST, etc.) à une fonction spécifique dans un contrôleur.

4.  **Middlewares (`/middleware`)** : Avant d'atteindre le contrôleur, la requête peut passer par un ou plusieurs middlewares. Par exemple, `authMiddleware.ts` vérifie si l'utilisateur est authentifié en validant le JWT présent dans les cookies. Si l'authentification échoue, le middleware peut renvoyer une erreur et arrêter le traitement.

5.  **Contrôleurs (`/controllers`)** : Le contrôleur (par exemple, `quizController.ts`) contient la logique métier. Il reçoit la requête, interagit avec la base de données via les modèles Mongoose, traite les données et décide de la réponse à renvoyer.

6.  **Modèles (`/models`)** : Le contrôleur utilise les modèles Mongoose (par exemple, `Quiz.ts`) pour effectuer des opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur la base de données MongoDB. Le modèle définit le schéma des données pour une collection (par exemple, la structure d'un quiz).

7.  **Vues (`/views`)** : Une fois que le contrôleur a récupéré les données nécessaires, il rend une vue EJS (par exemple, `LesQuiz.ejs`). Il passe les données à la vue, qui les utilise pour générer dynamiquement le code HTML.

8.  **Réponse HTTP** : Le HTML généré est finalement renvoyé au client en tant que réponse HTTP, et la page s'affiche dans le navigateur de l'utilisateur.
>>>>>>> Stashed changes
