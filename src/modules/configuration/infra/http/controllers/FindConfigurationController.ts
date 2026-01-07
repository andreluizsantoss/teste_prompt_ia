import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { FindConfigurationService } from '@modules/configuration/services/FindConfigurationService'
import { logger } from '@shared/logger/logger'

@injectable()
export class FindConfigurationController {
  constructor(
    @inject('FindConfigurationService')
    private service: FindConfigurationService,
  ) {}

  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const configuration = await this.service.execute()

      logger.info('Configuração carregada com sucesso.', {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json(configuration)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      // Verifica se é um erro customizado da aplicação (AppError)
      if (error.statusCode) {
        logger.warn('Falha ao carregar configuração', {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      // Erro inesperado (não é AppError)
      logger.error('Erro inesperado ao carregar configuração', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        path: request.path,
        ip: request.ip,
      })

      return response.status(500).json({
        message: 'Erro Interno do Servidor',
      })
    }
  }
}
