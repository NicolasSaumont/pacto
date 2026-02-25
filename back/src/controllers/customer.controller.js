import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  softDeleteCustomer,
} from '../services/customer.service.js'

export const getAll = async (req, res) => {
  try {
    const customers = await getCustomers()
    res.json(customers)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'customers.api.code.get-error-message' })
  }
}

export const getOne = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const customer = await getCustomerById(id)

    if (!customer) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    res.json({
      id: customer.id,
      name: customer.name,
      products: customer.customerProducts.map(cp => cp.product),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.get-error-message.customer' })
  }
}

export const create = async (req, res) => {
  const { name, productIds } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ code: 'api.code.missing-required-field' })
  }

  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }

  try {
    const customer = await createCustomer({ name, productIds })
    res.status(201).json(customer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

export const update = async (req, res) => {
  const id = Number(req.params.id)
  const { name, productIds } = req.body

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }

  if (productIds !== undefined && !Array.isArray(productIds)) {
    return res.status(400).json({ code: 'api.code.invalid-field' })
  }

  try {
    const existing = await getCustomerById(id)
    if (!existing) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    const updated = await updateCustomer(id, { name, productIds })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}

export const remove = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const existing = await getCustomerById(id)
    if (!existing) {
      return res.status(404).json({ code: 'api.code.not-found.customer' })
    }

    await softDeleteCustomer(id)

    res.status(200).json({ code: 'api.code.deleted.customer' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 'api.code.server-error' })
  }
}