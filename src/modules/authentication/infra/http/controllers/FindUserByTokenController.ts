import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { FindUserByTokenService } from '@modules/authentication/services/FindUserByTokenService'
import { logger } from '@shared/logger/logger'

@injectable()
export class FindUserByTokenController {
  constructor(
    @inject('FindUserByTokenService')
    private service: FindUserByTokenService,
  ) {}

  public async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id

    if (!userId) {
      return response.status(401).json({
        message: 'Usuário não autenticado.',
      })
    }

    try {
      const user = await this.service.execute(userId)

      logger.info(
        `Busca de usuário por token para ID: ${userId} bem-sucedida.`,
        {
          ip: request.ip,
          userAgent: request.get('User-Agent'),
        },
      )

      return response.status(200).json(user)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      // Verifica se é um erro customizado da aplicação (AppError)
      if (error.statusCode) {
        logger.warn(`Busca de usuário falhou para ID: ${userId}`, {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      // Erro inesperado (não é AppError)
      logger.error(
        `Erro inesperado na busca de usuário logado para ID: ${userId}`,
        {
          error: error.message,
          stack: error.stack,
          name: error.name,
          path: request.path,
          ip: request.ip,
        },
      )

      return response.status(500).json({
        message: 'Erro Interno do Servidor',
      })
    }
  }
}
