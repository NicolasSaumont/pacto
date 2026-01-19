require('dotenv').config()
const { Product, Customer } = require('./models')

const products = [
  { name: 'Jambon cru' },
  { name: 'Jambon blanc' },
  { name: 'Saucisson sec' },
  { name: 'Chorizo' },
  { name: 'Lard fumé' },
  { name: 'Rillettes de porc' },
]

const customers = [
  { name: 'Leclerc Martin' },
  { name: 'GAEC Bernard' },
  { name: 'Superette Dupont' },
]

const customerProductsMap = {
  'Leclerc Martin': [
    'Jambon cru',
    'Jambon blanc',
    'Saucisson sec',
    'Chorizo',
    'Lard fumé',
    'Rillettes de porc',
  ],
  'GAEC Bernard': ['Lard fumé', 'Rillettes de porc'],
  'Superette Dupont': ['Jambon blanc', 'Saucisson sec', 'Chorizo'],
}

const seedDB = async () => {
  try {
    console.log('📦 Seed products...')
    const productInstances = {}

    for (const product of products) {
      const [instance, created] = await Product.findOrCreate({
        where: { name: product.name },
        defaults: product,
      })
      productInstances[product.name] = instance
      console.log(created ? `✅ Créé : ${product.name}` : `ℹ️ Existe : ${product.name}`)
    }

    console.log('📦 Seed customers...')
    const customerInstances = {}

    for (const customer of customers) {
      const [instance, created] = await Customer.findOrCreate({
        where: { name: customer.name },
        defaults: customer,
      })
      customerInstances[customer.name] = instance
      console.log(created ? `✅ Créé : ${customer.name}` : `ℹ️ Existe : ${customer.name}`)
    }

    console.log('🔗 Seed relations customers ↔ products...')

    for (const [customerName, productNames] of Object.entries(customerProductsMap)) {
      const customer = customerInstances[customerName]
      const productsToLink = productNames.map(name => productInstances[name])
      await customer.setProducts(productsToLink) // Sequelize crée la table pivot si elle existe
      console.log(`🔗 ${customerName} → ${productNames.join(', ')}`)
    }

    console.log('🎉 Seed terminé !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err)
    process.exit(1)
  }
}

seedDB()
