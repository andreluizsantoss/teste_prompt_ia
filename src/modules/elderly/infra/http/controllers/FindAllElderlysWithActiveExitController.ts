import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { FindAllElderlysWithActiveExitService } from '@modules/elderly/services/FindAllElderlysWithActiveExitService'
import { logger } from '@shared/logger/logger'

@injectable()
export class FindAllElderlysWithActiveExitController {
  constructor(
    @inject('FindAllElderlysWithActiveExitService')
    private service: FindAllElderlysWithActiveExitService,
  ) {}

  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const elderlys = await this.service.execute()

      logger.info('Lista de idosos com saída ativa carregada com sucesso.', {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json(elderlys)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      if (error.statusCode) {
        logger.warn('Falha ao carregar idosos com saída ativa', {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      logger.error('Erro inesperado ao carregar idosos com saída ativa', {
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
