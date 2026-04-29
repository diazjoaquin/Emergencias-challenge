import { z } from 'zod'

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

const phoneSchema = z.object({
  number: z
    .string()
    .min(8, 'Phone number must have at least 8 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?\d+$/, 'Phone number must contain only digits (optional leading +)'),
  phoneTypeId: z.number().int().positive(),
})

const addressSchema = z.object({
  locality: z.string().min(2).max(100),
  street: z.string().min(2).max(100),
  number: z.number().int().positive().max(99999),
  notes: z.string().max(500).optional(),
})

export const createPersonSchema = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  dateOfBirth: dateSchema,
  email: z.string().email(),
  phones: z.array(phoneSchema).optional(),
  addresses: z.array(addressSchema).optional(),
})

export const updatePersonSchema = z.object({
  firstName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50).optional(),
  dateOfBirth: dateSchema.optional(),
  email: z.string().email().optional(),
})

export const searchPersonSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  dateOfBirth: dateSchema.optional(),
  phoneNumber: z.string().min(8).max(15).optional(),
  phoneTypeId: z.coerce.number().int().positive().optional(),
})
