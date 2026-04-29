import { Request, Response } from 'express'
import { activityService } from '../services/activity.service.js'
import { createActivitySchema, searchActivitySchema } from '../validators/activity.validator.js'

export const activityController = {
  async create(req: Request, res: Response) {
    const data = createActivitySchema.parse(req.body)
    const activity = await activityService.create(data)
    res.status(201).json(activity)
  },

  async search(req: Request, res: Response) {
    const params = searchActivitySchema.parse(req.query)
    const activities = await activityService.search(params)
    res.status(200).json(activities)
  },
}
