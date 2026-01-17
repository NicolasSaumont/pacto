require('dotenv').config()
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
    console.log('📦 Seed products...')

    for (const prod of products) {
      const [_, created] = await Product.findOrCreate({
        where: { name: prod.name },
        defaults: prod,
      })
      console.log(created ? `✅ Créé : ${prod.name}` : `ℹ️ Existe : ${prod.name}`)
    }

    console.log('🎉 Seed terminé !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err)
    if (err?.errors) {
      console.error('Détails:', err.errors.map(e => ({ path: e.path, value: e.value, message: e.message })))
    }
    process.exit(1)
  }
}

seedDB()
