const Customer = require('./Customer')
const Product = require('./Product')
const CustomerProduct = require('./CustomerProduct')
const Order = require('./Order')
const OrderProduct = require('./OrderProduct')

// MANY TO MANY
Customer.belongsToMany(Product, {
  through: CustomerProduct,
  as: 'products',             // Nom à utiliser dans include
  foreignKey: 'customerId',
  otherKey: 'product_id',
})

Product.belongsToMany(Customer, {
  through: CustomerProduct,
  as: 'customers',            // Nom de la relation inverse
  foreignKey: 'product_id',
  otherKey: 'customerId',
})

/** CUSTOMER 1..N ORDER */
Customer.hasMany(Order, { as: 'orders', foreignKey: 'customerId' })
Order.belongsTo(Customer, { as: 'customer', foreignKey: 'customerId' }),

/** ORDER N..N PRODUCT via ORDER_PRODUCT */
Order.belongsToMany(Product, {
  through: OrderProduct,
  as: 'products',
  foreignKey: 'order_id',
  otherKey: 'product_id',
})

Product.belongsToMany(Order, {
  through: OrderProduct,
  as: 'orders',
  foreignKey: 'product_id',
  otherKey: 'order_id',
})

/** Optionnel mais très pratique pour accéder à quantity facilement */
Order.hasMany(OrderProduct, { as: 'items', foreignKey: 'order_id' })
OrderProduct.belongsTo(Order, { as: 'order', foreignKey: 'order_id' })

Product.hasMany(OrderProduct, { as: 'orderItems', foreignKey: 'product_id' })
OrderProduct.belongsTo(Product, { as: 'product', foreignKey: 'product_id' })

module.exports = {
  Customer,
  CustomerProduct,
  Order,
  OrderProduct,
  Product,
}
