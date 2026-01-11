// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config()

// Import des modules nécessaires
const express = require('express')                        // Framework web pour créer un serveur HTTP
const cors = require('cors')                              // Middleware pour gérer le CORS (cross-origin requests)
const bodyParser = require('body-parser')                 // Middleware pour parser le JSON des requêtes
const { sequelize, connectDB } = require('./config/db')   // Import de Sequelize et fonction connectDB avec retry

// --- Couleurs pour les logs dans la console ---
const colors = {
  reset: '\x1b[0m',   // Reset couleur
  red: '\x1b[31m',    // Rouge pour erreurs
  green: '\x1b[32m',  // Vert pour succès
  yellow: '\x1b[33m', // Jaune pour warnings
  blue: '\x1b[34m',   // Bleu pour infos
}

// Création de l'application Express
const app = express()

// --- Middleware ---
// Autorise toutes les requêtes cross-origin
app.use(cors())
// Parse le corps JSON des requêtes HTTP
app.use(bodyParser.json())

// --- Routes ---
// Route de test pour vérifier que le backend fonctionne
app.get('/', (req, res) => {
  res.send('Backend opérationnel')
})

// Route pour les produits
const productsRouter = require('./routes/products')
app.use('/products', productsRouter)

// Définition du port sur lequel le serveur écoute
// On peut le configurer via .env, sinon il prend 3001 par défaut
const PORT = process.env.PORT || 3001

// --- Fonction principale pour démarrer le serveur ---
const startServer = async () => {
  try {
    console.log(`${colors.blue}⏳ Tentative de connexion à PostgreSQL...${colors.reset}`)

    // Se connecte à la DB avec retries (voir db.js)
    // Si Postgres n’est pas prêt, connectDB va attendre et réessayer
    await connectDB({ retries: 10, delay: 2000, verbose: true })

    console.log(`${colors.green}✅ PostgreSQL prêt !${colors.reset}`)

    // Synchronise tous les modèles Sequelize avec la DB
    // { force: false } = ne supprime pas les tables existantes
    await sequelize.sync({ force: false })
    console.log(`${colors.green}📦 Modèles synchronisés${colors.reset}`)

    // Démarre le serveur Express
    app.listen(PORT, () => {
      console.log(`${colors.green}🚀 Serveur démarré sur le port ${PORT}${colors.reset}`)
    })
  } catch (err) {
    // Si une erreur survient (ex: DB indisponible après tous les retries)
    // on logue en rouge et on quitte le process
    console.error(`${colors.red}❌ Erreur au démarrage du serveur :${colors.reset}`, err.message)
    process.exit(1)
  }
}

// Appel de la fonction pour lancer le serveur
startServer()
