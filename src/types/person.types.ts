import { z } from 'zod'
import {
  createPersonSchema,
  updatePersonSchema,
  searchPersonSchema,
} from '../validators/person.validator.js'

export type CreatePersonInput = z.infer<typeof createPersonSchema>
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>
export type PersonSearchParams = z.infer<typeof searchPersonSchema>
