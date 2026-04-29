import { z } from 'zod'
import {
  createActivitySchema,
  searchActivitySchema,
} from '../validators/activity.validator.js'

export type CreateActivityInput = z.infer<typeof createActivitySchema>
export type ActivitySearchParams = z.infer<typeof searchActivitySchema>
