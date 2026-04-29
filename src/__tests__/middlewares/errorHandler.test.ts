import { describe, it, expect, vi } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { ZodError, ZodIssueCode } from 'zod'
import { Prisma } from '@prisma/client'
import { errorHandler } from '../../middlewares/errorHandler.js'
import { AppError } from '../../lib/errors.js'

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response
  return res
}

const req = {} as Request
const next = vi.fn() as unknown as NextFunction

describe('errorHandler', () => {
  it('handles AppError with its status code and message', () => {
    const res = mockRes()
    const err = new AppError(404, 'Not found')

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' })
  })

  it('handles ZodError with 400 and validation issues', () => {
    const res = mockRes()
    const err = new ZodError([
      {
        code: ZodIssueCode.too_small,
        minimum: 3,
        type: 'string',
        inclusive: true,
        exact: false,
        message: 'Too short',
        path: ['firstName'],
      },
    ])

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Validation error' })
    )
  })

  it('handles Prisma P2002 (unique constraint) with 409', () => {
    const res = mockRes()
    const err = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
      code: 'P2002',
      clientVersion: '7.0.0',
    })

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'A record with this data already exists' })
  })

  it('handles Prisma P2025 (record not found) with 404', () => {
    const res = mockRes()
    const err = new Prisma.PrismaClientKnownRequestError('Not found', {
      code: 'P2025',
      clientVersion: '7.0.0',
    })

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Record not found' })
  })

  it('handles generic errors with 500', () => {
    const res = mockRes()
    const err = new Error('Something went wrong')

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' })
  })
})
