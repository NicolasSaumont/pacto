import { Router } from 'express'
import customersRouter from './customers.routes.js'
import productsRouter from './products.routes.js'
import ordersRouter from './orders.js'

const router = Router()

router.use('/customers', customersRouter)
router.use('/products', productsRouter)
router.use('/orders', ordersRouter)

export default router