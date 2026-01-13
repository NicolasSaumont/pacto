const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// DELETE /products/:id => supprime un produit selon l'id passé en paramètre
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' })
    }

    await product.destroy() // avec paranoid: true → soft delete
    return res.status(200).json({ message: 'Produit supprimé (soft delete)' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
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
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' })
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
      return res.status(404).json({ message: 'Produit non trouvé' })
    }

    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur lors de la récupération du produit' })
  }
})

// PATCH /products/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Nom requis' })
  }

  try {
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    // Tentative de mise à jour
    await product.update({ name })

    res.json(product)

  } catch (error) {
    // Si le nom existe déjà
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Un produit avec ce nom existe déjà' })
    }

    // Autres erreurs
    console.error(error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router
