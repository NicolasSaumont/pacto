const { sequelize } = require('./config/db')

;(async () => {
  try {
    console.log('🧹 Réinitialisation des tables...')
    await sequelize.query('TRUNCATE TABLE "products" RESTART IDENTITY CASCADE;')
    console.log('✅ Tables réinitialisées avec succès !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur reset :', err)
    process.exit(1)
  }
})()
