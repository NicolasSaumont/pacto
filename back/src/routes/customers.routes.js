import express from 'express'
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from '../controllers/customer.controller.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.patch('/:id', update)
router.delete('/:id', remove)

export default router