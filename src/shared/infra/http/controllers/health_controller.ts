import { Request, Response } from 'express'
import { AppDataSource } from '@shared/infra/database/data-source'

export class HealthController {
  public async check(req: Request, res: Response): Promise<Response> {
    const now = new Date()
    const timezoneOffset = -now.getTimezoneOffset() / 60

    const healthCheck = {
      status: 'ok',
      timestamp: now.toISOString(), // UTC (padrão internacional)
      timezone: {
        offset:
          timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`,
        description: `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`,
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'dev',
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
    } catch (error) {
      healthCheck.status = 'error'
      healthCheck.database.status = 'disconnected'

      return res.status(503).json(healthCheck)
    }
  }
}
