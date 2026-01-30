require('dotenv').config()
const { 
  Customer, 
  Order, 
  OrderProduct,
  Product, 
} = require('./models')

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

// Helpers dates
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9, 0, 0, 0)
  return d
}
const daysFrom = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  d.setHours(9, 0, 0, 0)
  return d
}

// 10 commandes "cohérentes" avec les autorisations client → produits
const ordersSeed = [
  {
    customerName: 'Leclerc Martin',
    orderDate: daysAgo(20),
    deliveryInDays: 2,
    comment: 'Réassort charcuterie - début de semaine',
    items: [
      { productName: 'Jambon cru', quantity: 12 },
      { productName: 'Saucisson sec', quantity: 25 },
      { productName: 'Chorizo', quantity: 18 },
    ],
  },
  {
    customerName: 'Leclerc Martin',
    orderDate: daysAgo(14),
    deliveryInDays: 1,
    comment: 'Promo week-end',
    items: [
      { productName: 'Jambon blanc', quantity: 30 },
      { productName: 'Rillettes de porc', quantity: 15 },
    ],
  },
  {
    customerName: 'Leclerc Martin',
    orderDate: daysAgo(9),
    deliveryInDays: 3,
    comment: 'Commande régulière',
    items: [
      { productName: 'Lard fumé', quantity: 10 },
      { productName: 'Chorizo', quantity: 12 },
      { productName: 'Saucisson sec', quantity: 20 },
    ],
  },
  {
    customerName: 'Leclerc Martin',
    orderDate: daysAgo(3),
    deliveryInDays: 2,
    comment: 'Réassort express',
    items: [
      { productName: 'Jambon cru', quantity: 8 },
      { productName: 'Jambon blanc', quantity: 16 },
    ],
  },

  {
    customerName: 'GAEC Bernard',
    orderDate: daysAgo(18),
    deliveryInDays: 4,
    comment: 'Commande GAEC - lot fumé',
    items: [
      { productName: 'Lard fumé', quantity: 6 },
    ],
  },
  {
    customerName: 'GAEC Bernard',
    orderDate: daysAgo(11),
    deliveryInDays: 2,
    items: [
      { productName: 'Rillettes de porc', quantity: 10 },
      { productName: 'Lard fumé', quantity: 4 },
    ],
  },
  {
    customerName: 'GAEC Bernard',
    orderDate: daysAgo(5),
    deliveryInDays: 1,
    comment: 'Complément semaine',
    items: [
      { productName: 'Rillettes de porc', quantity: 6 },
    ],
  },

  {
    customerName: 'Superette Dupont',
    orderDate: daysAgo(16),
    deliveryInDays: 2,
    items: [
      { productName: 'Jambon blanc', quantity: 10 },
      { productName: 'Chorizo', quantity: 8 },
    ],
  },
  {
    customerName: 'Superette Dupont',
    orderDate: daysAgo(10),
    deliveryInDays: 2,
    items: [
      { productName: 'Saucisson sec', quantity: 15 },
      { productName: 'Chorizo', quantity: 6 },
    ],
  },
  {
    customerName: 'Superette Dupont',
    orderDate: daysAgo(2),
    deliveryInDays: 1,
    comment: 'Avant week-end',
    items: [
      { productName: 'Jambon blanc', quantity: 12 },
      { productName: 'Saucisson sec', quantity: 10 },
    ],
  },
]

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

    console.log('🧾 Seed orders + order products...')
    for (const o of ordersSeed) {
      const customer = customerInstances[o.customerName]
      if (!customer) throw new Error(`Customer not found in seed: ${o.customerName}`)

      // Vérif "cohérence" : produits commandés ∈ produits autorisés
      const allowedNames = new Set(customerProductsMap[o.customerName] || [])
      const forbidden = o.items
        .map(i => i.productName)
        .filter(name => !allowedNames.has(name))

      if (forbidden.length) {
        throw new Error(
          `Forbidden products for "${o.customerName}": ${forbidden.join(', ')}`
        )
      }

      // 1) Crée la commande
      const order = await Order.create({
        customerId: customer.id,
        orderDate: o.orderDate,
        deliveryDate: o.deliveryInDays !== undefined ? daysFrom(o.orderDate, o.deliveryInDays) : null,
        comment: o.comment ?? null,
      })

      // 2) Crée les lignes (table pivot) avec quantité
      const lines = o.items.map((item) => {
        const product = productInstances[item.productName]
        if (!product) throw new Error(`Product not found in seed: ${item.productName}`)

        return {
          order_id: order.id,
          product_id: product.id,
          quantity: item.quantity,
        }
      })

      await OrderProduct.bulkCreate(lines)

      console.log(
        `🧾 Order #${order.id} (${o.customerName}) → ` +
        o.items.map(i => `${i.productName} x${i.quantity}`).join(', ')
      )
    }

    console.log('🎉 Seed terminé !')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err)
    process.exit(1)
  }
}

seedDB()
