import 'dotenv/config'             // Charge automatiquement les variables d'environnement
import express from 'express'      // Framework web
import cors from 'cors'            // Middleware CORS
import bodyParser from 'body-parser' // Middleware JSON
import { sequelize, connectDB } from './config/db.js'

// Routes centralisées
import routes from './routes/index.js'

// --- Couleurs pour les logs console ---
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

// Création de l'app
const app = express()

// --- Middleware ---
app.use(cors())
app.use(bodyParser.json())

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Backend opérationnel')
})

app.use('/', routes)


// Port
const PORT = process.env.BACK_PORT || 3001

// --- Démarrage serveur ---
const startServer = async () => {
  try {
    console.log(`${colors.blue}⏳ Tentative de connexion à PostgreSQL...${colors.reset}`)

    // Connexion à PostgreSQL avec retries
    await connectDB({ retries: 10, delay: 2000, verbose: true })
    console.log(`${colors.green}✅ PostgreSQL prêt !${colors.reset}`)

    // Synchronisation Sequelize
    await sequelize.sync({ force: true })
    console.log(`${colors.green}📦 Modèles synchronisés${colors.reset}`)

    // Lancement serveur
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`${colors.green}🚀 Serveur démarré sur le port ${PORT}${colors.reset}`)
    })
  } catch (err) {
    console.error(`${colors.red}❌ Erreur au démarrage du serveur :${colors.reset}`, err.message)
    process.exit(1)
  }
}

// Lancement
startServer()