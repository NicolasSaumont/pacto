const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { Order, OrderProduct, Customer, Product, sequelize } = require('../models')

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

// PATCH /orders/:id => modifie une commande existante selon l'id passé en paramètre
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const {
    customerId,
    orderDate,
    deliveryDate,
    comment,
    items,
  } = req.body

  try {
    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    // 1️⃣ PATCH DES CHAMPS SIMPLES
    const fieldsToUpdate = {}

    if (customerId !== undefined) fieldsToUpdate.customerId = customerId
    if (orderDate !== undefined) fieldsToUpdate.orderDate = orderDate
    if (deliveryDate !== undefined) fieldsToUpdate.deliveryDate = deliveryDate
    if (comment !== undefined) fieldsToUpdate.comment = comment

    if (Object.keys(fieldsToUpdate).length) {
      await order.update(fieldsToUpdate)
    }

    // 2️⃣ PATCH DES ITEMS (produits + quantités)
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({ code: 'api.code.invalid-field.items' })
      }

      // Format attendu :
      // [{ productId, quantity }]

      // Supprime toutes les lignes existantes
      await OrderProduct.destroy({
        where: { order_id: order.id },
      })

      // Recrée les lignes
      const rows = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
      }))

      if (rows.length) {
        await OrderProduct.bulkCreate(rows)
      }
    }

    // 3️⃣ Retourne la commande mise à jour
    const updatedOrder = await Order.findByPk(id, {
      include: [
        { association: 'customer' },
        {
          association: 'items',
          include: [{ association: 'product' }],
        },
      ],
    })

    res.json(updatedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /orders => crée une nouvelle commande
router.post('/', async (req, res) => {
  console.log('api post order')
  const {
    customerId,
    orderDate,
    deliveryDate,
    comment,
    items,
  } = req.body

  if (!customerId || !orderDate) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  if (items && !Array.isArray(items)) {
    return res.status(400).json({ code: 'api.code.invalid-field.items' })
  }

  const transaction = await sequelize.transaction()

  try {
    // 1️⃣ Création de la commande
    const order = await Order.create({
      customerId,
      orderDate,
      deliveryDate,
      comment,
    }, { transaction })

    // 2️⃣ Création des lignes de commande
    if (items?.length) {
      await OrderProduct.bulkCreate(
        items.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity ?? 1,
        })),
        { transaction }
      )
    }

    await transaction.commit()

    return res.status(201).json(order)
  } catch (error) {
    await transaction.rollback()
    console.error(error)
    return res.status(500).json({ code: 'api.code.server-error' })
  }
})


module.exports = router
