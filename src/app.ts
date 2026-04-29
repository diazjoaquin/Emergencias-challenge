import express, { Application } from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import personRouter from './routes/person.routes.js'

const app: Application = express()

app.use(express.json())

app.use('/persons', personRouter)

app.use(errorHandler)

export default app
