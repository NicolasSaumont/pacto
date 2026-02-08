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
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }
      if (endDate && Number.isNaN(end.getTime())) {
        return res.status(400).json({ code: 'api.code.invalid-field' })
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

  const t = await sequelize.transaction()

  try {
    const order = await Order.findByPk(id, { transaction: t })

    if (!order) {
      await t.rollback()
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    // 1️⃣ Patch champs simples
    const fieldsToUpdate = {}
    if (customerId !== undefined) fieldsToUpdate.customerId = customerId
    if (orderDate !== undefined) fieldsToUpdate.orderDate = orderDate
    if (deliveryDate !== undefined) fieldsToUpdate.deliveryDate = deliveryDate
    if (comment !== undefined) fieldsToUpdate.comment = comment

    if (Object.keys(fieldsToUpdate).length) {
      await order.update(fieldsToUpdate, { transaction: t })
    }

    // 2️⃣ Patch items diff (add/update/remove)
    if (items !== undefined) {
      if (items === null || typeof items !== 'object' || Array.isArray(items)) {
        await t.rollback()
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }

      const { add, update, remove } = items

      // --- VALIDATION BASIQUE ---
      if (add !== undefined && !Array.isArray(add)) {
        await t.rollback()
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }
      if (update !== undefined && !Array.isArray(update)) {
        await t.rollback()
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }
      if (remove !== undefined && !Array.isArray(remove)) {
        await t.rollback()
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }

      // --- REMOVE ---
      if (remove?.length) {
        // sécurité: on supprime uniquement des lignes de CETTE commande
        await OrderProduct.destroy({
          where: {
            id: { [Op.in]: remove },
            order_id: order.id,
          },
          transaction: t,
        })
      }

      // --- UPDATE ---
      if (update?.length) {
        // on met à jour une par une (simple + safe)
        for (const u of update) {
          const rowId = u?.id
          const qty = u?.quantity

          if (typeof rowId !== 'number' || typeof qty !== 'number') {
            await t.rollback()
            return res.status(400).json({ code: 'api.code.invalid-field.row' })
          }

          // sécurité: update uniquement si la ligne appartient à la commande
          const [count] = await OrderProduct.update(
            { quantity: qty },
            {
              where: { id: rowId, order_id: order.id },
              transaction: t,
            }
          )

          // si tu veux être strict : si ligne non trouvée -> 400
          if (count === 0) {
            await t.rollback()
            return res.status(400).json({ code: 'api.code.invalid-field.not-found' })
          }
        }
      }

      // --- ADD ---
      if (add?.length) {
        const rows = add.map(a => {
          const productId = a?.productId
          const qty = a?.quantity

          if (typeof productId !== 'number' || typeof qty !== 'number') {
            throw Object.assign(new Error('invalid add row'), {
              status: 400,
              code: 'api.code.invalid-field.row',
            })
          }

          return {
            order_id: order.id,
            product_id: productId,
            quantity: qty,
          }
        })

        if (rows.length) {
          await OrderProduct.bulkCreate(rows, { transaction: t })
        }
      }
    }

    await t.commit()

    // 3️⃣ Retourne la commande à jour
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { association: 'customer' },
        { association: 'items', include: [{ association: 'product' }] },
      ],
    })

    return res.json(updatedOrder)
  } catch (error) {
    console.error(error)

    if (t && !t.finished) await t.rollback()

    // si tu as throw un objet custom avec status/code
    if (error?.status) {
      return res.status(error.status).json({ code: error.code || 'api.code.bad-request' })
    }

    return res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /orders => crée une nouvelle commande
router.post('/', async (req, res) => {
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
    return res.status(400).json({ code: 'api.code.invalid-field' })
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
          product_name: item.productName,
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
