# Multi-stage build pour optimiser la taille de l'image
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Stage de production avec Nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=builder /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]