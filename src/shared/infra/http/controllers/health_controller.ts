import { Request, Response } from 'express'
import { AppDataSource } from '@shared/infra/database/data-source'
import { env } from '@shared/env'

export class HealthController {
  public async check(req: Request, res: Response): Promise<Response> {
    // Obter data/hora no timezone do Brasil (UTC-3)
    const now = new Date()
    const brasilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)

    const healthCheck = {
      status: 'ok',
      timestamp: brasilTime.toISOString(), // Horário do Brasil (UTC-3)
      uptime: process.uptime(),
      environment: env.ILPI_CONCIERGE_NODE_ENV,
      database: {
        status: 'disconnected',
      },
    }

    try {
      // Verifica conexão com o banco
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1')
        healthCheck.database.status = 'connected'
      }

      return res.status(200).json(healthCheck)
    } catch (_error) {
      healthCheck.status = 'error'
      healthCheck.database.status = 'disconnected'

      return res.status(503).json(healthCheck)
    }
  }
}
