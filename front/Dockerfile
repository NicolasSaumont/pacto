FROM node:22-alpine

WORKDIR /app

# Copier uniquement les dépendances
COPY package*.json ./

RUN npm install

# Copier le reste
COPY . .

# Build Nuxt
RUN npm run build

# Variables pour Docker
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000

# Lancer le serveur Nuxt
CMD ["node", ".output/server/index.mjs"]