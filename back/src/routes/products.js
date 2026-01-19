const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// DELETE /products/:id => supprime un produit existant selon l'id passé en paramètre
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    await product.destroy() // avec paranoid: true → soft delete
    return res.status(200).json({ code: 'api.code.deleted.product' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// GET /products => renvoie tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name'] 
    })
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'products.api.code.get-error-message' })
  }
})

// GET /products/:id => renvoie un produit selon l'id passé en paramètre
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id, {
      attributes: ['id', 'name'] 
    })

    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.product' })
  }
})

// PATCH /products/:id => modifie un produit existant selon l'id passé en paramètre
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  try {
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    // Tentative de mise à jour
    await product.update({ name })

    res.json(product)

  } catch (error) {
    // Si le nom existe déjà
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ code: 'api.code.duplicate-name.product' })
    }

    // Autres erreurs
    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
})

// POST /products => crée un nouveau produit
router.post('/', async (req, res) => {
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  try {
    const product = await Product.create({ name })

    return res.status(201).json(product)

  } catch (error) {
    // Nom déjà existant
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ code: 'api.code.duplicate-name.product' })
    }

    console.error(error)
    return res.status(500).json({ code: 'api.code.server-error' })
  }
})

module.exports = router
