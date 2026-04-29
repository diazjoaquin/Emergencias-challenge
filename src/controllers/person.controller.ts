import { Request, Response } from 'express'
import { personService } from '../services/person.service.js'
import {
  createPersonSchema,
  updatePersonSchema,
  searchPersonSchema,
} from '../validators/person.validator.js'

export const personController = {
  async create(req: Request, res: Response) {
    const data = createPersonSchema.parse(req.body)
    const person = await personService.create(data)
    res.status(201).json(person)
  },

  async search(req: Request, res: Response) {
    const params = searchPersonSchema.parse(req.query)
    const persons = await personService.search(params)
    res.status(200).json(persons)
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = updatePersonSchema.parse(req.body)
    const person = await personService.update(id, data)
    res.status(200).json(person)
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id)
    await personService.remove(id)
    res.status(204).send()
  },
}
