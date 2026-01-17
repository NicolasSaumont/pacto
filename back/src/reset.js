const { sequelize } = require('./config/db')
const Product = require('./models/Product')

;(async () => {
  try {
    console.log('🧹 Réinitialisation des tables...')

    // Supprime toutes les tables + réinitialise les séquences
    await sequelize.query('TRUNCATE TABLE "products" RESTART IDENTITY CASCADE;')

    // Truncate pour vider complètement chaque table
    await Product.destroy({ where: {}, truncate: true, restartIdentity: true })

    console.log('✅ Tables réinitialisées avec succès !')

    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur reset :', err)
    process.exit(1)
  }
})()
