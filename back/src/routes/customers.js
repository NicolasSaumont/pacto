const express = require('express')
const router = express.Router()
const Customer = require('../models/Customer')

// // DELETE /products/:id => supprime un produit existant selon l'id passé en paramètre
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const product = await Product.findByPk(id)

//     if (!product) {
//       return res.status(404).json({ code: 'product.api.code.not-found' })
//     }

//     await product.destroy() // avec paranoid: true → soft delete
//     return res.status(200).json({ code: 'product.api.code.deleted' })

//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ code: 'product.api.code.server-error' })
//   }
// })

// GET /customers => renvoie tous les clients
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: ['id', 'name'] 
    })
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'customers.api.code.get-error-message' })
  }
})

// // GET /products/:id => renvoie un produit selon l'id passé en paramètre
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params
//     const product = await Product.findByPk(id, {
//       attributes: ['id', 'name'] 
//     })

//     if (!product) {
//       return res.status(404).json({ code: 'product.api.code.not-found' })
//     }

//     res.json(product)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ code: 'product.api.code.get-error-message' })
//   }
// })

// // PATCH /products/:id => modifie un produit existant selon l'id passé en paramètre
// router.patch('/:id', async (req, res) => {
//   const { id } = req.params
//   const { name } = req.body

//   if (!name?.trim()) {
//     return res.status(400).json({ code: 'product.api.code.missing-required-field' })
//   }

//   try {
//     const product = await Product.findByPk(id)

//     if (!product) {
//       return res.status(404).json({ code: 'product.api.code.not-found' })
//     }

//     // Tentative de mise à jour
//     await product.update({ name })

//     res.json(product)

//   } catch (error) {
//     // Si le nom existe déjà
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({ code: 'product.api.code.duplicate-name' })
//     }

//     // Autres erreurs
//     console.error(error)
//     res.status(500).json({ code: 'product.api.code.server-error' })
//   }
// })

// // POST /products => crée un nouveau produit
// router.post('/', async (req, res) => {
//   const { name } = req.body

//   if (!name?.trim()) {
//     return res.status(400).json({ code: 'product.api.code.missing-required-field' })
//   }

//   try {
//     const product = await Product.create({ name })

//     return res.status(201).json(product)

//   } catch (error) {
//     // Nom déjà existant
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({ code: 'product.api.code.duplicate-name' })
//     }

//     console.error(error)
//     return res.status(500).json({ code: 'product.api.code.server-error' })
//   }
// })

module.exports = router
