import {
  createProduct,
  updateProduct,
  softDeleteProduct,
  getProductById,
  getProducts,
} from '../services/product.service.js'

export const getAll = async (req, res) => {
  try {
    const products = await getProducts()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'products.api.code.get-error-message' })
  }
}

export const getOne = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const product = await getProductById(id)

    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.product' })
  }
}

export const create = async (req, res) => {
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  try {
    const product = await createProduct({ name })
    res.status(201).json(product)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ code: 'api.code.duplicate-name.product' })
    }

    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

export const update = async (req, res) => {
  const id = Number(req.params.id)
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  try {
    const product = await getProductById(id)
    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    const updatedProduct = await updateProduct(id, { name })

    res.json(updatedProduct)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ code: 'api.code.duplicate-name.product' })
    }

    console.error(error)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

export const remove = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const product = await getProductById(id)
    if (!product) {
      return res.status(404).json({ code: 'api.code.not-found.product' })
    }

    await softDeleteProduct(id)

    res.status(200).json({ code: 'api.code.deleted.product' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}