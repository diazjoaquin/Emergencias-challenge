import prisma from '../lib/prisma.js'
import { AppError } from '../lib/errors.js'
import type { CreatePersonInput, UpdatePersonInput, PersonSearchParams } from '../types/person.types.js'

const personInclude = {
  phones: { include: { phoneType: true } },
  addresses: true,
}

export const personService = {
  async create(data: CreatePersonInput) {
    return prisma.person.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
        phones: data.phones ? { create: data.phones } : undefined,
        addresses: data.addresses ? { create: data.addresses } : undefined,
      },
      include: personInclude,
    })
  },

  async search(params: PersonSearchParams) {
    const { email, firstName, lastName, dateOfBirth, phoneNumber, phoneTypeId } = params

    if (email) {
      const person = await prisma.person.findUnique({
        where: { email },
        include: personInclude,
      })
      return person ? [person] : []
    }

    if (phoneNumber !== undefined || phoneTypeId !== undefined) {
      return prisma.person.findMany({
        where: {
          phones: {
            some: {
              ...(phoneNumber !== undefined ? { number: phoneNumber } : {}),
              ...(phoneTypeId !== undefined ? { phoneTypeId } : {}),
            },
          },
        },
        include: personInclude,
      })
    }

    return prisma.person.findMany({
      where: {
        ...(firstName ? { firstName: { contains: firstName, mode: 'insensitive' } } : {}),
        ...(lastName ? { lastName: { contains: lastName, mode: 'insensitive' } } : {}),
        ...(dateOfBirth ? { dateOfBirth } : {}),
      },
      include: personInclude,
    })
  },

  async update(id: number, data: UpdatePersonInput) {
    const exists = await prisma.person.findUnique({ where: { id } })
    if (!exists) throw new AppError(404, 'Person not found')

    return prisma.person.update({
      where: { id },
      data,
      include: personInclude,
    })
  },

  async remove(id: number) {
    const exists = await prisma.person.findUnique({ where: { id } })
    if (!exists) throw new AppError(404, 'Person not found')

    await prisma.person.delete({ where: { id } })
  },
}
