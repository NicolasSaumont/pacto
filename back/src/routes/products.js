const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

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

module.exports = router
