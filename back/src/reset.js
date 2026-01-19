const { sequelize } = require('./config/db')
const { Product, Customer } = require('./models')

;(async () => {
  try {
    console.log('🧹 Réinitialisation des tables...')
    
    // Sync toutes les tables Sequelize
    // force:true supprime/recrée toutes les tables, y compris les tables de liaison
    await sequelize.sync({ force: true })
    
    console.log('✅ Tables réinitialisées avec succès !')
    process.exit(0)

  } catch (err) {
    console.error('❌ Erreur reset :', err)
    process.exit(1)
  }
})()
