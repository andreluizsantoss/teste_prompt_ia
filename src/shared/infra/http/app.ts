import 'reflect-metadata'
import 'express-async-errors'
import '@shared/infra/http/container'
import express, { NextFunction, Request, Response } from 'express'
import { logger } from '@shared/logger/logger'
import cors from 'cors'
import { env } from '@shared/env'
import { routes } from './routes'
import { errorHandler } from '@shared/middlewares/errorHandler'

const app = express()

app.set('trust proxy', true)
app.use(cors())
app.use(express.json())

// initializeApp({
//   credential: applicationDefault(),
//   projectId: 'ilpi-concierge-app',
// })

app.use((req: Request, res: Response, next: NextFunction) => {
  const clientType = req.header('x-client-type')
  if (clientType === env.ILPI_CONCIERGE_FRONTEND_PERMISSION) {
    logger.info('Requisição identificada como App Mobile', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    })
    return next()
  }

  logger.warn('Requisição sem identificação de App Mobile', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    clientType,
  })

  return res.status(403).json({
    message: 'Access denied.',
  })
})

// Routes
app.use(routes)

// Error Handler (deve ser o último middleware)
app.use(errorHandler)

export { app }
