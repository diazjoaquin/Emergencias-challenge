import { describe, it, expect, vi, beforeEach } from 'vitest'
import { personService } from '../../services/person.service.js'
import { AppError } from '../../lib/errors.js'

vi.mock('../../lib/prisma.js', () => ({
  default: {
    person: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('personService.create', () => {
  it('creates and returns a person', async () => {
    vi.mocked(prisma.person.create).mockResolvedValue(mockPerson)

    const result = await personService.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      dateOfBirth: '1990-01-15',
      email: 'juan@example.com',
    })

    expect(result).toEqual(mockPerson)
    expect(prisma.person.create).toHaveBeenCalledOnce()
  })
})

describe('personService.search', () => {
  it('searches by email using findUnique', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(mockPerson)

    const result = await personService.search({ email: 'juan@example.com' })

    expect(prisma.person.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: 'juan@example.com' } })
    )
    expect(result).toEqual([mockPerson])
  })

  it('returns empty array when email not found', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(null)

    const result = await personService.search({ email: 'noexiste@example.com' })

    expect(result).toEqual([])
  })

  it('searches by phone number and type using findMany', async () => {
    vi.mocked(prisma.person.findMany).mockResolvedValue([mockPerson])

    const result = await personService.search({ phoneNumber: '1123456789', phoneTypeId: 1 })

    expect(prisma.person.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { phones: { some: expect.any(Object) } } })
    )
    expect(result).toEqual([mockPerson])
  })

  it('searches by personal data using findMany', async () => {
    vi.mocked(prisma.person.findMany).mockResolvedValue([mockPerson])

    const result = await personService.search({ firstName: 'Juan', lastName: 'Pérez' })

    expect(prisma.person.findMany).toHaveBeenCalledOnce()
    expect(result).toEqual([mockPerson])
  })
})

describe('personService.update', () => {
  it('updates and returns the person', async () => {
    const updated = { ...mockPerson, firstName: 'Carlos' }
    vi.mocked(prisma.person.findUnique).mockResolvedValue(mockPerson)
    vi.mocked(prisma.person.update).mockResolvedValue(updated)

    const result = await personService.update(1, { firstName: 'Carlos' })

    expect(prisma.person.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 }, data: { firstName: 'Carlos' } })
    )
    expect(result).toEqual(updated)
  })

  it('throws AppError 404 when person does not exist', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(null)

    await expect(personService.update(999, { firstName: 'Carlos' })).rejects.toThrow(AppError)
    await expect(personService.update(999, { firstName: 'Carlos' })).rejects.toThrow('Person not found')
  })
})

describe('personService.remove', () => {
  it('deletes the person', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(mockPerson)
    vi.mocked(prisma.person.delete).mockResolvedValue(mockPerson)

    await personService.remove(1)

    expect(prisma.person.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('throws AppError 404 when person does not exist', async () => {
    vi.mocked(prisma.person.findUnique).mockResolvedValue(null)

    await expect(personService.remove(999)).rejects.toThrow(AppError)
    await expect(personService.remove(999)).rejects.toThrow('Person not found')
  })
})
