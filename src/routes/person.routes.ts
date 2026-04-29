import { Router } from 'express'
import { personController } from '../controllers/person.controller.js'

const router = Router()

router.post('/', personController.create)
router.get('/', personController.search)
router.patch('/:id', personController.update)
router.delete('/:id', personController.remove)

export default router
