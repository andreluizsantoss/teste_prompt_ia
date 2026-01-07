import { createServer } from 'http'
import { app } from './app'
import { env } from '@shared/env'
import { logger } from '@shared/logger/logger'
import { initializeDatabase } from '@shared/infra/database/data-source'

const httpServer = createServer(app)

// Inicializar banco antes de subir servidor
initializeDatabase().then(() => {
  httpServer.listen(env.ILPI_CONCIERGE_PORT, () => {
    logger.info(`🚀 HTTP server started on port ${env.ILPI_CONCIERGE_PORT}!`)
    logger.info(`🌍 Environment: ${env.ILPI_CONCIERGE_NODE_ENV}`)
  })
})

export { httpServer }
