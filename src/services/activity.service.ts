import prisma from '../lib/prisma.js'
import { AppError } from '../lib/errors.js'
import type { CreateActivityInput, ActivitySearchParams } from '../types/activity.types.js'

const personSelect = {
  firstName: true,
  lastName: true,
  email: true,
  dateOfBirth: true,
}

export const activityService = {
  async create(data: CreateActivityInput) {
    const personExists = await prisma.person.findUnique({ where: { id: data.personId } })
    if (!personExists) throw new AppError(404, 'Person not found')

    return prisma.contactActivity.create({
      data,
      include: { person: { select: personSelect } },
    })
  },

  async search(params: ActivitySearchParams) {
    return prisma.contactActivity.findMany({
      where: {
        ...(params.personId !== undefined ? { personId: params.personId } : {}),
        ...(params.activityType !== undefined ? { activityType: params.activityType } : {}),
      },
      include: { person: { select: personSelect } },
    })
  },
}
