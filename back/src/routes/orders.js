const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { Order, OrderProduct, Customer, Product } = require('../models')

// DELETE /orders/:id => supprime une commande existante selon l'id passé en paramètre
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    await order.destroy() // avec paranoid: true → soft delete
    return res.status(200).json({ code: 'api.code.deleted.order' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// GET /orders?startDate=2026-01-01&endDate=2026-01-31 => renvoie toutes les commandes, éventuellement filtrées par date
router.get('/', async (req, res) => {
  console.log('GET /orders called with query:', req.query)
  try {
    const { startDate, endDate } = req.query

    const where = {}

    // Filtre date si fourni
    if (startDate || endDate) {
      // on accepte start seul, end seul, ou les deux
      const start = startDate ? new Date(String(startDate)) : null
      const end = endDate ? new Date(String(endDate)) : null

      // validation simple
      if (startDate && Number.isNaN(start.getTime())) {
        return res.status(400).json({ code: 'api.code.invalid-field.start-date' })
      }
      if (endDate && Number.isNaN(end.getTime())) {
        return res.status(400).json({ code: 'api.code.invalid-field.end-date' })
      }

      // si endDate est une date "YYYY-MM-DD", on veut inclure toute la journée
      if (end) end.setHours(23, 59, 59, 999)

      if (start && end) where.orderDate = { [Op.between]: [start, end] }
      else if (start) where.orderDate = { [Op.gte]: start }
      else if (end) where.orderDate = { [Op.lte]: end }
    }

    const orders = await Order.findAll({
      attributes: ['id', 'comment', 'orderDate', 'deliveryDate'],
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        // On passe par "items" pour avoir l'id de la ligne + quantity + product
        {
          model: OrderProduct,
          as: 'items',
          attributes: ['id', 'quantity'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['orderDate', 'DESC']],
    })

    // Mapping -> shape front
    const data = orders.map((order) => ({
      id: order.id,
      comment: order.comment ?? undefined,
      orderDate: order.orderDate,          // ISO string (JSON)
      deliveryDate: order.deliveryDate ?? undefined,

      customer: order.customer
        ? { id: order.customer.id, name: order.customer.name }
        : null,

      items: (order.items ?? []).map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product
          ? { id: item.product.id, name: item.product.name }
          : null,
      })),
    }))

    res.json(data)
  } catch (err) {
    console.error(err)
    console.error('GET /orders error:', err)
    res.status(500).json({ code: 'orders.api.code.get-error-message' })
  }
})

// GET /orders/:id => renvoie une commande selon l'id passé en paramètre
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findByPk(id, {
      attributes: ['id', 'comment', 'orderDate', 'deliveryDate'],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        // On passe par "items" pour avoir l'id de la ligne + quantity + product
        {
          model: OrderProduct,
          as: 'items',
          attributes: ['id', 'quantity'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.order' })
  }
})

// // PATCH /customers/:id => modifie un client existant selon l'id passé en paramètre
// router.patch('/:id', async (req, res) => {
//   const { id } = req.params
//   const { name, productIds } = req.body

//   // name optionnel en PATCH (sinon impossible de patch uniquement les produits)
//   if (name !== undefined && !String(name).trim()) {
//     return res.status(400).json({ code: 'api.code.invalid-field.name' })
//   }

//   // productIds optionnel
//   if (productIds !== undefined && !Array.isArray(productIds)) {
//     return res.status(400).json({ code: 'api.code.invalid-field.product-ids' })
//   }

//   try {
//     const customer = await Customer.findByPk(id)

//     if (!customer) {
//       return res.status(404).json({ code: 'api.code.not-found.customer' })
//     }

//     // 1) update du client (si fourni)
//     if (name !== undefined) {
//       await customer.update({ name })
//     }

//     // 2) update des associations produits (si fourni)
//     if (productIds !== undefined) {
//       // Optionnel: sécuriser en filtrant ids uniques
//       const uniqueIds = [...new Set(productIds)]

//       // Remplace totalement les associations
//       await customer.setProducts(uniqueIds)
//     }

//     res.json(customer)
//   } catch (error) {
//     // Si le nom existe déjà
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({ code: 'api.code.duplicate-name.customer' })
//     }

//     // Autres erreurs
//     console.error(error)
//     res.status(500).json({ code: 'api.code.server-error' })
//   }
// })

// // POST /customers => crée un nouveau client
// router.post('/', async (req, res) => {
//   const { name, productIds } = req.body

//   if (!name?.trim()) {
//     return res.status(400).json({ code: 'api.code.missing-required-field' })
//   }

//   // productIds optionnel
//   if (productIds !== undefined && !Array.isArray(productIds)) {
//     return res.status(400).json({ code: 'api.code.invalid-field.product-ids' })
//   }

//   try {
//     const customer = await Customer.create({ name })

//     // Si produits fournis, on crée les associations
//     if (productIds?.length) {
//       const uniqueIds = [...new Set(productIds)]
//       await customer.setProducts(uniqueIds)
//     }

//     return res.status(201).json(customer)
//   } catch (error) {
//     // Nom déjà existant
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({ code: 'api.code.duplicate-name.customer' })
//     }

//     console.error(error)
//     return res.status(500).json({ code: 'api.code.server-error' })
//   }
// })

module.exports = router
