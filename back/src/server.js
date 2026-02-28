import path from 'path'
import os from 'os'
import 'dotenv/config'

// --- Définir le chemin SQLite pour Electron ---
const dbPath = process.env.DATABASE_URL || path.join(os.homedir(), 'Pacto', 'data.db')
process.env.DATABASE_URL = `file:${dbPath}`

// --- Import Prisma **après** avoir défini DATABASE_URL ---
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes/index.js'

// --- Couleurs pour logs ---
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
}

// --- Création de l'app ---
const app = express()
app.use(cors())
app.use(bodyParser.json())

// --- Route test ---
app.get('/', (req, res) => res.send('Backend opérationnel'))

// --- Routes métiers centralisées ---
app.use('/api', routes) // toutes tes routes /customers, /products, /orders passent par /api

// --- Port ---
const PORT = process.env.BACK_PORT || 3001

// --- Lancement serveur ---
const startServer = async () => {
  try {
    console.log(`${colors.blue}⏳ Initialisation Prisma + SQLite...${colors.reset}`)

    await prisma.$connect()
    console.log(`${colors.green}✅ Prisma prêt !${colors.reset}`)
    console.log(`${colors.green}📁 DB: ${dbPath}${colors.reset}`)

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`${colors.green}🚀 Serveur démarré sur le port ${PORT}${colors.reset}`)
    })
  } catch (err) {
    console.error(`${colors.red}❌ Erreur au démarrage du serveur :${colors.reset}`, err)
    process.exit(1)
  }
}

// --- Lancement ---
startServer()