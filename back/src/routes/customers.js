const express = require('express')
const router = express.Router()
const { Customer, Product } = require('../models')

// DELETE /customers/:id => supprime un client existant selon l'id passé en paramètre
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const customer = await Customer.findByPk(id)

    if (!customer) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    await customer.destroy() // avec paranoid: true → soft delete
    return res.status(200).json({ code: 'api.code.deleted.customer' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// GET /customers => renvoie tous les clients
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: ['id', 'name'],
    })
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'customers.api.code.get-error-message' })
  }
})

// GET /customers/:id => renvoie un client selon l'id passé en paramètre
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const customer = await Customer.findByPk(id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: Product,
          as: 'products', // renomme la relation
          attributes: ['id', 'name'],
          through: { attributes: [] }, // ignore les colonnes de la table de liaison
        },
      ],
    })

    if (!customer) {
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

// PATCH /customers/:id => modifie un client existant selon l'id passé en paramètre
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name, productIds } = req.body

  // name optionnel en PATCH (sinon impossible de patch uniquement les produits)
  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ code: 'api.code.invalid-field.name' })
  }

  // productIds optionnel
  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field.product-ids' })
  }

  try {
    const customer = await Customer.findByPk(id)

    if (!customer) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    // 1️⃣ update du client (si fourni)
    if (name !== undefined) {
      await customer.update({ name })
    }

    // 2️⃣ update des associations produits (si fourni)
    if (productIds !== undefined) {
      // Optionnel: sécuriser en filtrant ids uniques
      const uniqueIds = [...new Set(productIds)]

      // Remplace totalement les associations
      await customer.setProducts(uniqueIds)
    }

    res.json(customer)
  } catch (error) {
    // Si le nom existe déjà
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ code: 'api.code.duplicate-name.customer' })
    }

    // Autres erreurs
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /customers => crée un nouveau client
router.post('/', async (req, res) => {
  const { name, productIds } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  // productIds optionnel
  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field.product-ids' })
  }

  try {
    const customer = await Customer.create({ name })

    // Si produits fournis, on crée les associations
    if (productIds?.length) {
      const uniqueIds = [...new Set(productIds)]
      await customer.setProducts(uniqueIds)
    }

    return res.status(201).json(customer)
  } catch (error) {
    // Nom déjà existant
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ code: 'api.code.duplicate-name.customer' })
    }

    console.error(error)
    return res.status(500).json({ code: 'api.code.server-error' })
  }
})

module.exports = router
