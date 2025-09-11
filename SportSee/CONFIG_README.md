# Configuration de l'application SportSee

## Variables d'environnement

Pour configurer l'application, vous pouvez créer un fichier `.env` à la racine du projet avec ces variables :

```bash
# Environnement : DEV ou PROD
VITE_APP_ENV=DEV

# ID de l'utilisateur actuel (pour simuler le login)
VITE_USER_ID=12

# URL de l'API backend (uniquement utilisé en PROD)
VITE_API_URL=http://localhost:3000
```

## Modes de fonctionnement

### Mode DEV (par défaut)
- Utilise les fichiers JSON locaux dans `/public/data/`
- Pas besoin du serveur backend
- Idéal pour le développement

### Mode PROD
- Se connecte à l'API backend
- Nécessite que le serveur backend soit démarré
- Utilise l'URL définie dans `VITE_API_URL`

## Changer d'utilisateur

Pour tester avec un autre utilisateur :
```bash
VITE_USER_ID=18  # Pour Cecilia
VITE_USER_ID=12  # Pour Karl (par défaut)
```

## Démarrage

```bash
# Mode développement
npm run dev

# Avec le backend (pour tester le mode PROD)
# Terminal 1 :
cd SportSee-Back && npm start

# Terminal 2 :
cd SportSee && npm run dev
```
