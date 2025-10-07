# TP Mongoose CRUD

Projet de base pour le TP d'intégration MongoDB avec Express et TypeScript.

## Installation
1. npm install
2. npm run dev


## Fonctionnalités

- Connexion à MongoDB (quizApp) via Mongoose
- Modèle User : name (string, requis), email (string, requis, unique), createdAt (date, défaut Date.now)
- Route POST /users : création d'un utilisateur
	- Validation des données (name requis, email requis et au format email)
	- Retourne 201 et l'utilisateur créé
	- Retourne 400 si les données sont invalides
- Middleware global d'erreur (500) et 404 pour les routes inexistantes

## Exemple requête POST /users

```json
{
	"name": "Alice",
	"email": "alice@example.com"
}
```

## Test avec Postman

1. Démarrer le serveur : npm run dev
2. Envoyer une requête POST sur http://localhost:3000/users avec un body JSON
