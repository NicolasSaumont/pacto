const Customer = require('./Customer')
const Product = require('./Product')
const CustomerProduct = require('./CustomerProduct')

// MANY TO MANY
Customer.belongsToMany(Product, {
  through: CustomerProduct,
  foreignKey: 'customer_id',
  otherKey: 'product_id',
})

Product.belongsToMany(Customer, {
  through: CustomerProduct,
  foreignKey: 'product_id',
  otherKey: 'customer_id',
})

module.exports = {
  Customer,
  Product,
  CustomerProduct,
}
