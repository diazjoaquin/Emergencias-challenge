import { Router } from 'express'
import { activityController } from '../controllers/activity.controller.js'

const router = Router()

router.post('/', activityController.create)
router.get('/', activityController.search)

export default router
