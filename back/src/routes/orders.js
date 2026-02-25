// /back/src/routes/orders.js
import express from 'express'
import { PrismaClient } from '../generated/prisma/index.js'

const router = express.Router()
const prisma = new PrismaClient()

// DELETE /orders/:id => soft delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const order = await prisma.order.findUnique({ where: { id: Number(id) } })
    if (!order || order.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    await prisma.order.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    })

    res.status(200).json({ code: 'api.code.deleted.order' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// GET /orders?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD => toutes les commandes filtrées
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const where = { deletedAt: null }

    if (startDate || endDate) {
      const start = startDate ? new Date(String(startDate)) : undefined
      const end = endDate ? new Date(String(endDate)) : undefined
      if (start && isNaN(start.getTime()) || end && isNaN(end.getTime())) {
        return res.status(400).json({ code: 'api.code.invalid-field' })
      }
      if (start && end) end.setHours(23, 59, 59, 999)

      where.orderDate = start && end
        ? { gte: start, lte: end }
        : start ? { gte: start } : { lte: end }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        items: {
          include: { product: { select: { id: true, name: true } } }
        },
      },
      orderBy: { orderDate: 'desc' },
    })

    // reshape pour le front
    const data = orders.map(order => ({
      id: order.id,
      comment: order.comment ?? undefined,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate ?? undefined,
      customer: order.customer ? { id: order.customer.id, name: order.customer.name } : null,
      items: (order.items ?? []).map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product ? { id: item.product.id, name: item.product.name } : null
      })),
    }))

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'orders.api.code.get-error-message' })
  }
})

// GET /orders/:id => une commande
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        customer: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true } } } },
      }
    })

    if (!order || order.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.order' })
  }
})

// PATCH /orders/:id => modifie une commande
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { customerId, orderDate, deliveryDate, comment, items } = req.body

  try {
    const order = await prisma.order.findUnique({ where: { id: Number(id) } })
    if (!order || order.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.order' })
    }

    // update champs simples
    const updateData = {}
    if (customerId !== undefined) updateData.customerId = customerId
    if (orderDate !== undefined) updateData.orderDate = new Date(orderDate)
    if (deliveryDate !== undefined) updateData.deliveryDate = new Date(deliveryDate)
    if (comment !== undefined) updateData.comment = comment

    // update commande
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        // si items fournis, on supprime toutes les anciennes lignes et reconnecte les nouvelles
        items: items ? {
          deleteMany: {},
          create: items.map(i => ({
            quantity: i.quantity,
            product: { connect: { id: i.productId } }
          }))
        } : undefined
      },
      include: { customer: true, items: { include: { product: true } } },
    })

    res.json(updatedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /orders => crée une commande
router.post('/', async (req, res) => {
  const { customerId, orderDate, deliveryDate, comment, items } = req.body
  if (!customerId || !orderDate) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  try {
    const order = await prisma.order.create({
      data: {
        customerId,
        orderDate: new Date(orderDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        comment,
        items: items?.length ? {
          create: items.map(i => ({
            quantity: i.quantity ?? 1,
            product: { connect: { id: i.productId } }
          }))
        } : undefined,
      },
      include: { customer: true, items: { include: { product: true } } }
    })

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

export default router