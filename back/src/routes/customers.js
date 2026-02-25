// /back/src/routes/customers.js
// ----------------------------
// Routes ESM pour gérer les clients avec Prisma

import express from 'express'
import { PrismaClient } from '../generated/prisma/index.js'

const router = express.Router()
const prisma = new PrismaClient()

// DELETE /customers/:id => soft delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const customer = await prisma.customer.findUnique({ where: { id: Number(id) } })
    if (!customer || customer.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    await prisma.customer.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    })

    res.status(200).json({ code: 'api.code.deleted.customer' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// GET /customers => tous les clients non supprimés
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    })
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'customers.api.code.get-error-message' })
  }
})

// GET /customers/:id => client + produits
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        products: { select: { id: true, name: true } },
        deletedAt: true,
      },
    })

    if (!customer || customer.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    res.json({
      id: customer.id,
      name: customer.name,
      products: customer.products,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.customer' })
  }
})

// PATCH /customers/:id => modifie client et produits associés
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name, productIds } = req.body

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }
  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { id: Number(id) } })
    if (!customer || customer.deletedAt) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    const updateData = {}
    if (name !== undefined) {
      updateData.name = name
      updateData.name_normalized = name.toLowerCase()
    }
    if (productIds !== undefined) {
      updateData.products = { set: productIds.map(pid => ({ id: Number(pid) })) }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(id) },
      data: updateData,
    })

    res.json(updatedCustomer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /customers => créer un client + associer produits
router.post('/', async (req, res) => {
  const { name, productIds } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }
  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        name_normalized: name.toLowerCase(),
        products: productIds?.length
          ? { connect: productIds.map(pid => ({ id: Number(pid) })) }
          : undefined,
      },
    })

    res.status(201).json(customer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

export default router