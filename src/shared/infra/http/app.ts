import 'reflect-metadata'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from '@shared/env'
import { routes } from './routes'
import { errorHandler } from '@shared/middlewares/errorHandler'

const app = express()

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)

// Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use(routes)

// Error Handler (deve ser o último middleware)
app.use(errorHandler)

export { app }
