require('dotenv').config()
const { sequelize } = require('./config/db')
const Product = require('./models/Product')

const products = [
  { name: 'Jambon cru' },
  { name: 'Jambon blanc' },
  { name: 'Saucisson sec' },
  { name: 'Chorizo' },
  { name: 'Lard fumé' },
  { name: 'Rillettes de porc' },
]

const seedDB = async () => {
  try {
    // Synchronise la table sans la supprimer
    await sequelize.sync({ force: false })
    console.log('📦 Table products synchronisée')

    for (const prod of products) {
      const [product, created] = await Product.findOrCreate({
        where: { name: prod.name }, // évite les doublons
        defaults: prod,
      })
      if (created) {
        console.log(`✅ Produit créé : ${prod.name}`)
      } else {
        console.log(`ℹ️ Produit déjà existant : ${prod.name}`)
      }
    }

    console.log('🎉 Seed terminé !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err)
    process.exit(1)
  }
}

seedDB()
