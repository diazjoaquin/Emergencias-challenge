import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { AppError } from '../lib/errors.js'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', errors: err.issues })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ message: 'A record with this data already exists' })
      return
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Record not found' })
      return
    }
  }

  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
}
