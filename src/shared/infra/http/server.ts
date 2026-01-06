import { createServer } from 'http'
import { app } from './app'
import { env } from '@shared/env'
import { logger } from '@shared/logger/logger'
import { initializeDatabase } from '@shared/infra/database/data-source'

const httpServer = createServer(app)

// Inicializar banco antes de subir servidor
initializeDatabase().then(() => {
  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 HTTP server started on port ${env.PORT}!`)
    logger.info(`🌍 Environment: ${env.NODE_ENV}`)
  })
})

export { httpServer }
