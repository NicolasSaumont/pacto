import express from 'express'
import {
  create,
  update,
  remove,
  getAll,
  getOne,
} from '../controllers/product.controller.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.patch('/:id', update)
router.delete('/:id', remove)

export default router