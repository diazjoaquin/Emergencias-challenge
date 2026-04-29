import { z } from 'zod'

const activityDateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/,
    'activityDate must be in YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS format'
  )

export const activityTypeSchema = z.enum(['call', 'meeting', 'email'])

export const createActivitySchema = z.object({
  personId: z.number().int().positive(),
  activityType: activityTypeSchema,
  activityDate: activityDateSchema,
  description: z.string().max(1000).optional(),
})

export const searchActivitySchema = z.object({
  personId: z.coerce.number().int().positive().optional(),
  activityType: activityTypeSchema.optional(),
})
