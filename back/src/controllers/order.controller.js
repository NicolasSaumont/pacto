// /back/src/controllers/order.controller.js
import * as orderService from '../services/order.service.js'

// GET /orders
export const getAll = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.query)

    const data = orders.map(order => ({
      id: order.id,
      comment: order.comment ?? undefined,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate ?? undefined,
      customer: order.customer
        ? { id: order.customer.id, name: order.customer.name }
        : null,
      items: (order.orderProducts ?? []).map(op => ({
        id: op.id,
        quantity: op.quantity,
        product: op.product ? { id: op.product.id, name: op.product.name } : null,
      })),
    }))

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'orders.api.code.get-error-message' })
  }
}

// GET /orders/:id
export const getOne = async (req, res) => {
  try {
    const order = await orderService.getOrderById(Number(req.params.id))
    if (!order) return res.status(404).json({ code: 'api.code.not-found.order' })

    const data = {
      id: order.id,
      comment: order.comment ?? undefined,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate ?? undefined,
      customer: order.customer
        ? { id: order.customer.id, name: order.customer.name }
        : null,
      items: (order.orderProducts ?? []).map(op => ({
        id: op.id,
        quantity: op.quantity,
        product: op.product ? { id: op.product.id, name: op.product.name } : null,
      })),
    }

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.order' })
  }
}

// POST /orders
export const create = async (req, res) => {
  try {
    const { customerId, orderDate } = req.body
    if (!customerId || !orderDate) {
      return res.status(400).json({ code: 'api.code.missing-required-field' })
    }

    const order = await orderService.createOrder(req.body)

    const data = {
      ...order,
      items: (order.orderProducts ?? []).map(op => ({
        id: op.id,
        quantity: op.quantity,
        product: op.product ? { id: op.product.id, name: op.product.name } : null,
      })),
    }

    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

// PATCH /orders/:id
export const update = async (req, res) => {
  try {
    const order = await orderService.updateOrder(Number(req.params.id), req.body)

    const data = {
      ...order,
      items: (order.orderProducts ?? []).map(op => ({
        id: op.id,
        quantity: op.quantity,
        product: op.product ? { id: op.product.id, name: op.product.name } : null,
      })),
    }

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

// DELETE /orders/:id
export const remove = async (req, res) => {
  try {
    await orderService.softDeleteOrder(Number(req.params.id))
    res.json({ code: 'api.code.deleted.order' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}