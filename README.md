# Canva Pro IA - Guide de Déploiement Sécurisé

Cette application utilise une architecture **Full-Stack (Express + Vite)** pour garantir que votre clé API Gemini reste secrète et ne soit jamais exposée dans le navigateur de l'utilisateur.

## Architecture
- **Frontend (React)** : Gère l'interface utilisateur et envoie les requêtes au serveur local.
- **Backend (Express)** : Reçoit les requêtes du frontend, ajoute la clé API secrète, et appelle l'API Gemini de Google.

## Comment déployer en toute sécurité

### 1. Sur GitHub
- Le fichier `.gitignore` empêche déjà l'envoi de votre fichier `.env` sur GitHub.
- Ne mettez **JAMAIS** votre clé API dans `README.md` ou `.env.example`.

### 2. Sur votre plateforme de déploiement (Vercel, Netlify, Cloud Run, etc.)
1. Importez votre projet depuis GitHub.
2. Allez dans les **Paramètres (Settings)** de l'application.
3. Cherchez la section **Environment Variables** (Variables d'environnement).
4. Ajoutez une nouvelle variable :
   - **Key** : `GEMINI_API_KEY`
   - **Value** : `VOTRE_CLE_API_ICI`
5. Déployez. La plateforme utilisera cette clé de manière sécurisée côté serveur.

## Développement Local
1. Installez les dépendances : `npm install`
2. Créez un fichier `.env` à la racine.
3. Ajoutez votre clé : `GEMINI_API_KEY=votre_cle`
4. Lancez l'application : `npm run dev`

---
*Créé avec Canva Pro IA - Le futur de la création visuelle.*
