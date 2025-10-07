# TP Mongoose CRUD

Projet de base pour le TP d'intégration MongoDB avec Express et TypeScript.

## Installation
1. npm install
2. npm run dev


## Fonctionnalités

- Connexion à MongoDB (quizApp) via Mongoose
- Modèle User : name (string, requis), email (string, requis, unique), password (string, requis, haché), createdAt (date, défaut Date.now)
- Authentification sécurisée avec bcrypt et JWT
- Routes :
	- POST /register : inscription
	- POST /login : connexion (retourne un token JWT)
	- GET /profile : profil utilisateur (protégé, nécessite un token)
	- POST /users : création d'un utilisateur (admin)
- Middleware d'authentification pour protéger les routes
- Middleware global d'erreur (500) et 404 pour les routes inexistantes

## Exemple requête POST /register

```json
{
	"name": "Alice",
	"email": "alice@example.com",
	"password": "monmotdepasse"
}
```

## Exemple requête POST /login

```json
{
	"email": "alice@example.com",
	"password": "monmotdepasse"
}
```

## Exemple requête GET /profile

Header : Authorization: Bearer <token>

## Test avec Postman

1. Démarrer le serveur : npm run dev
2. Envoyer une requête POST sur http://localhost:3000/register puis /login
3. Utiliser le token reçu pour accéder à /profile
