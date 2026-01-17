require('dotenv').config()
const Product = require('./models/Product')
const Customer = require('./models/Customer')

const products = [
  { name: 'Jambon cru' },
  { name: 'Jambon blanc' },
  { name: 'Saucisson sec' },
  { name: 'Chorizo' },
  { name: 'Lard fumé' },
  { name: 'Rillettes de porc' },
]

const customers = [
  { name: 'Boucherie Martin' },
  { name: 'Boucherie Bernard' },
  { name: 'Boucherie Dupont' },
]

const seedDB = async () => {
  try {
    console.log('📦 Seed products...')

    for (const product of products) {
      const [_, created] = await Product.findOrCreate({
        where: { name: product.name },
        defaults: product,
      })
      console.log(created ? `✅ Créé : ${product.name}` : `ℹ️ Existe : ${product.name}`)
    }

    console.log('📦 Seed customers...')

    for (const customer of customers) {
      const [_, created] = await Customer.findOrCreate({
        where: { name: customer.name },
        defaults: customer,
      })
      console.log(created ? `✅ Créé : ${customer.name}` : `ℹ️ Existe : ${customer.name}`)
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
