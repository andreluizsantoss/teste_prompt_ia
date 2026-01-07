import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { UpdateAccessTokenService } from '@modules/authenticate/services/UpdateAccessTokenService'
import { logger } from '@shared/logger/logger'

@injectable()
export class UpdateAccessTokenController {
  constructor(
    @inject('UpdateAccessTokenService')
    private service: UpdateAccessTokenService,
  ) {}

  public async update(request: Request, response: Response): Promise<Response> {
    const bodySchema = z.object({
      refreshToken: z.string().min(1, 'Refresh token é obrigatório.'),
    })

    const parseResult = bodySchema.safeParse(request.body)

    if (!parseResult.success) {
      return response.status(400).json({
        message: 'Validação falhou',
        errors: parseResult.error.issues,
      })
    }

    const { refreshToken } = parseResult.data

    try {
      const { access_token, refresh_token } = await this.service.execute({
        refreshToken,
      })

      logger.info('Tokens atualizados com sucesso.', {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json({
        access_token,
        refresh_token,
      })
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      // Verifica se é um erro customizado da aplicação (AppError)
      if (error.statusCode) {
        logger.warn('Atualização de token falhou', {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      // Erro inesperado (não é AppError)
      logger.error('Erro inesperado na atualização de token', {
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
