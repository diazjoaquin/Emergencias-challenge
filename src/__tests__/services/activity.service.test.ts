import { describe, it, expect, vi, beforeEach } from 'vitest'
import { activityService } from '../../services/activity.service.js'
import { AppError } from '../../lib/errors.js'

vi.mock('../../lib/prisma.js', () => ({
  default: {
    person: {
      findUnique: vi.fn(),
    },
    contactActivity: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

const { default: prisma } = await import('../../lib/prisma.js')

const mockPerson = {
  id: 1,
  firstName: 'Juan',
  lastName: 'Pérez',
  dateOfBirth: '1990-01-15',
  email: 'juan@example.com',
  phones: [],
  addresses: [],
}

const mockActivity = {
  id: 1,
  personId: 1,
  activityType: 'call' as const,
  activityDate: '2024-01-15T10:30:00',
  description: 'Follow-up call',
  person: {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    dateOfBirth: '1990-01-15',
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('activityService.create', () => {
  it('creates and returns an activity with person details', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(mockPerson)
    vi.mocked(prisma.contactActivity.create).mockResolvedValue(mockActivity)

    const result = await activityService.create({
      personId: 1,
      activityType: 'call',
      activityDate: '2024-01-15T10:30:00',
      description: 'Follow-up call',
    })

    expect(prisma.person.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(prisma.contactActivity.create).toHaveBeenCalledOnce()
    expect(result).toEqual(mockActivity)
  })

  it('throws AppError 404 when person does not exist', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(null)

    await expect(
      activityService.create({
        personId: 999,
        activityType: 'call',
        activityDate: '2024-01-15',
      })
    ).rejects.toThrow(AppError)

    await expect(
      activityService.create({
        personId: 999,
        activityType: 'call',
        activityDate: '2024-01-15',
      })
    ).rejects.toThrow('Person not found')

    expect(prisma.contactActivity.create).not.toHaveBeenCalled()
  })
})

describe('activityService.search', () => {
  it('returns all activities when no filters applied', async () => {
    vi.mocked(prisma.contactActivity.findMany).mockResolvedValue([mockActivity])

    const result = await activityService.search({})

    expect(prisma.contactActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    )
    expect(result).toEqual([mockActivity])
  })

  it('filters by personId', async () => {
    vi.mocked(prisma.contactActivity.findMany).mockResolvedValue([mockActivity])

    await activityService.search({ personId: 1 })

    expect(prisma.contactActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { personId: 1 } })
    )
  })

  it('filters by activityType', async () => {
    vi.mocked(prisma.contactActivity.findMany).mockResolvedValue([mockActivity])

    await activityService.search({ activityType: 'call' })

    expect(prisma.contactActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { activityType: 'call' } })
    )
  })

  it('filters by both personId and activityType', async () => {
    vi.mocked(prisma.contactActivity.findMany).mockResolvedValue([mockActivity])

    await activityService.search({ personId: 1, activityType: 'meeting' })

    expect(prisma.contactActivity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { personId: 1, activityType: 'meeting' } })
    )
  })
})
