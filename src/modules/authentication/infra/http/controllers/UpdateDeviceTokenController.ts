import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { UpdateDeviceTokenService } from '@modules/authentication/services/UpdateDeviceTokenService'
import { logger } from '@shared/logger/logger'

@injectable()
export class UpdateDeviceTokenController {
  constructor(
    @inject('UpdateDeviceTokenService')
    private service: UpdateDeviceTokenService,
  ) {}

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user?.id

    if (!userId) {
      return response.status(401).json({
        message: 'Usuário não autenticado.',
      })
    }

    const bodySchema = z.object({
      iosDeviceToken: z.string().optional(),
      androidDeviceToken: z.string().optional(),
    })

    const parseResult = bodySchema.safeParse(request.body)

    if (!parseResult.success) {
      return response.status(400).json({
        message: 'Validação falhou',
        errors: parseResult.error.issues,
      })
    }

    const { iosDeviceToken, androidDeviceToken } = parseResult.data

    try {
      const user = await this.service.execute({
        userId,
        iosDeviceToken,
        androidDeviceToken,
      })

      logger.info('Atualização de device token bem-sucedida.', {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json(user)
    } catch (err) {
      const error = err as Error & { statusCode?: number }

      // Verifica se é um erro customizado da aplicação (AppError)
      if (error.statusCode) {
        logger.warn(`Atualização de device token falhou para ID: ${userId}`, {
          path: request.path,
        })

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      // Erro inesperado (não é AppError)
      logger.error(
        `Erro inesperado na atualização de device token para ID: ${userId}`,
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
