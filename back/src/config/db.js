const { Sequelize } = require('sequelize')

// Création de l'instance Sequelize pour PostgreSQL
// process.env.PG_URL = url complète de la DB, ex: postgres://user:pass@db:5432/mydb
const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres', // Type de DB
  logging: false,      // Désactive les logs SQL
})

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
}

// Fonction pour se connecter à PostgreSQL avec retries
// On attend que la DB soit prête avant de démarrer le serveur
const connectDB = async ({ retries = 5, delay = 2000, verbose = false } = {}) => {
  let attempt = 1

  // Boucle de retry
  while (attempt <= retries) {
    try {
      // Tentative de connexion
      await sequelize.authenticate()

      // Si verbose, affiche un message de succès
      if (verbose) console.log(`${colors.green}✅ Connexion à PostgreSQL réussie !${colors.reset}`)

      // Connexion OK → on sort de la fonction
      return
    } catch (err) {
      // Si erreur, affiche un warning avec le numéro de tentative
      console.log(`${colors.yellow}⚠️ Postgres non prêt, tentative ${attempt}/${retries} dans ${delay}ms...${colors.reset}`)

      // Attend le temps défini avant la prochaine tentative
      await new Promise(r => setTimeout(r, delay))
      attempt++
    }
  }

  // Si toutes les tentatives échouent → throw une erreur
  throw new Error('Impossible de se connecter à PostgreSQL après plusieurs tentatives.')
}

// Export de Sequelize et de la fonction de connexion
module.exports = { sequelize, connectDB }
