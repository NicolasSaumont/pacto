// /back/src/services/order.service.js
import prisma from '../../prisma/client.js'

// --- GET ORDERS ---
export const getOrders = async ({ startDate, endDate } = {}) => {
  const where = { deletedAt: null }

  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    if (start && end) end.setHours(23, 59, 59, 999)
    where.orderDate = start && end
      ? { gte: start, lte: end }
      : start ? { gte: start } : { lte: end }
  }

  return prisma.order.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true } },
      orderProducts: { include: { product: { select: { id: true, name: true } } } },
    },
    orderBy: { orderDate: 'desc' },
  })
}

// --- GET ORDER BY ID ---
export const getOrderById = async (id) => {
  return prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: { select: { id: true, name: true } },
      orderProducts: { include: { product: { select: { id: true, name: true } } } },
    },
  })
}

// --- CREATE ORDER ---
export const createOrder = async ({ customerId, orderDate, deliveryDate, comment, items }) => {
  if (!items?.length) {
    items = []
  }

  // Récupère les noms des produits depuis la table Product
  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
    select: { id: true, name: true },
  })

  const orderProductsData = items.map(i => {
    const product = products.find(p => p.id === i.productId)
    return {
      quantity: i.quantity ?? 1,
      productId: i.productId,
      productName: product?.name ?? 'Produit inconnu',
    }
  })

  return prisma.order.create({
    data: {
      customerId,
      orderDate: new Date(orderDate),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      comment,
      orderProducts: orderProductsData.length ? { create: orderProductsData } : undefined,
    },
    include: {
      customer: true,
      orderProducts: { include: { product: true } },
    },
  })
}

// --- UPDATE ORDER ---
export const updateOrder = async (id, body) => {
  const {
    customerId,
    orderDate,
    deliveryDate,
    comment,
    items,
  } = body

  return prisma.$transaction(async (tx) => {
    // 1️⃣ vérifier la commande
    const order = await tx.order.findFirst({
      where: { id, deletedAt: null },
    })

    if (!order) {
      const err = new Error('Order not found')
      err.status = 404
      err.code = 'api.code.not-found.order'
      throw err
    }

    // 2️⃣ update champs simples
    const data = {}

    if (customerId !== undefined) data.customerId = customerId
    if (orderDate !== undefined) data.orderDate = new Date(orderDate)
    if (deliveryDate !== undefined) {
      data.deliveryDate = deliveryDate ? new Date(deliveryDate) : null
    }
    if (comment !== undefined) data.comment = comment

    if (Object.keys(data).length) {
      await tx.order.update({
        where: { id },
        data,
      })
    }

    // 3️⃣ gestion items diff
    if (items !== undefined) {
      if (items === null || typeof items !== 'object' || Array.isArray(items)) {
        const err = new Error('Invalid items')
        err.status = 400
        err.code = 'api.code.invalid-field'
        throw err
      }

      const { add, update, remove } = items

      // ---------- REMOVE ----------
      if (remove?.length) {
        await tx.orderProduct.deleteMany({
          where: {
            id: { in: remove },
            orderId: id, // sécurité
          },
        })
      }

      // ---------- UPDATE ----------
      if (update?.length) {
        for (const u of update) {
          const rowId = u?.id
          const qty = u?.quantity

          if (typeof rowId !== 'number' || typeof qty !== 'number') {
            const err = new Error('Invalid row')
            err.status = 400
            err.code = 'api.code.invalid-field.row'
            throw err
          }

          const updated = await tx.orderProduct.updateMany({
            where: {
              id: rowId,
              orderId: id, // sécurité
            },
            data: {
              quantity: qty,
            },
          })

          if (updated.count === 0) {
            const err = new Error('Row not found')
            err.status = 400
            err.code = 'api.code.invalid-field.not-found'
            throw err
          }
        }
      }

      // ---------- ADD ----------
      if (add?.length) {
        const rows = []

        for (const a of add) {
          const productId = a?.productId
          const qty = a?.quantity

          if (typeof productId !== 'number' || typeof qty !== 'number') {
            const err = new Error('Invalid add row')
            err.status = 400
            err.code = 'api.code.invalid-field.row'
            throw err
          }

          const product = await tx.product.findUnique({
            where: { id: productId },
          })

          if (!product) {
            const err = new Error('Product not found')
            err.status = 400
            err.code = 'api.code.invalid-field.product'
            throw err
          }

          rows.push({
            orderId: id,
            productId,
            productName: product.name, // 🔥 important pour ton schéma
            quantity: qty,
          })
        }

        if (rows.length) {
          await tx.orderProduct.createMany({
            data: rows,
          })
        }
      }
    }

    // 4️⃣ retour commande complète
    return tx.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderProducts: {
          include: { product: true },
        },
      },
    })
  })
}

// --- SOFT DELETE ORDER ---
export const softDeleteOrder = async (id) => {
  return prisma.order.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}