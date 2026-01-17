const { sequelize } = require('./config/db')
const Product = require('./models/Product')
const Customer = require('./models/Customer')

;(async () => {
  try {
    console.log('🧹 Réinitialisation des tables...')

    // Supprime toutes les tables + réinitialise les séquences
    await sequelize.query(`
      TRUNCATE TABLE
        "products",
        "customers"
      RESTART IDENTITY CASCADE;
    `)

    console.log('✅ Tables réinitialisées avec succès !')
    process.exit(0)

  } catch (err) {
    console.error('❌ Erreur reset :', err)
    process.exit(1)
  }
})()
