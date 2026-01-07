import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { FindElderlyByIdService } from '@modules/elderly/services/FindElderlyByIdService'
import { logger } from '@shared/logger/logger'

@injectable()
export class FindElderlyByIdController {
  constructor(
    @inject('FindElderlyByIdService')
    private service: FindElderlyByIdService,
  ) {}

  public async show(request: Request, response: Response): Promise<Response> {
    const querySchema = z.object({
      id: z.string().min(1, 'ID é obrigatório.'),
    })

    const parseResult = querySchema.safeParse(request.query)

    if (!parseResult.success) {
      return response.status(400).json({
        message: 'Validação falhou',
        errors: parseResult.error.issues,
      })
    }

    const { id } = parseResult.data

    try {
      const elderly = await this.service.execute(id)

      logger.info(`Idoso ID: ${id} carregado com sucesso.`, {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json(elderly)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      if (error.statusCode) {
        logger.warn(`Falha ao carregar idoso ID: ${id}`, {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      logger.error(`Erro inesperado ao carregar idoso ID: ${id}`, {
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
