import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middlewares/errorHandler.js'
import personRouter from './routes/person.routes.js'
import activityRouter from './routes/activity.routes.js'
import swaggerSpec from './config/swagger.js'

const app: Application = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/persons', personRouter)
app.use('/activities', activityRouter)

app.use(errorHandler)

export default app
