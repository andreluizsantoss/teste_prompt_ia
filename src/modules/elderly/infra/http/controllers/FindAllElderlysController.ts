import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { FindAllElderlysService } from '@modules/elderly/services/FindAllElderlysService'
import { logger } from '@shared/logger/logger'

@injectable()
export class FindAllElderlysController {
  constructor(
    @inject('FindAllElderlysService')
    private service: FindAllElderlysService,
  ) {}

  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const elderlys = await this.service.execute()

      logger.info('Lista de idosos carregada com sucesso.', {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json(elderlys)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      if (error.statusCode) {
        logger.warn('Falha ao carregar lista de idosos', {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      logger.error('Erro inesperado ao carregar lista de idosos', {
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
