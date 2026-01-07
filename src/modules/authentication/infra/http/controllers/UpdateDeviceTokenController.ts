import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { UpdateDeviceTokenService } from '@modules/authentication/services/UpdateDeviceTokenService'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
import { logger } from '@shared/logger/logger'

@injectable()
export class UpdateDeviceTokenController {
  constructor(
    @inject('UpdateDeviceTokenService')
    private service: UpdateDeviceTokenService,
  ) {}

  public async update(
    request: Request,
    response: Response,
  ): Promise<Response> {
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

      logger.info(`Atualização de device token bem-sucedida.`, {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      // Remover dados sensíveis adicionais antes de retornar
      const {
        senha,
        login,
        androidToken,
        iosToken,
        refreshToken,
        status,
        foto,
        ...userPublicData
      } = user

      return response.status(200).json(userPublicData)
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        logger.warn(`Usuário não encontrado para ID: "${userId}".`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(404).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotPermissionError) {
        logger.warn(
          `Usuário sem permissão para ID: "${userId}": Permissão negada.`,
          {
            error: (err as Error).message,
            path: request.path,
          },
        )
        return response.status(403).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotLoginError) {
        logger.warn(`Usuário sem login para ID: "${userId}": Login negado.`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      logger.error(
        `Erro inesperado na atualização de device token para ID: ${userId}: Erro Interno do Servidor`,
        {
          error: (err as Error).message,
          path: request.path,
        },
      )

      return response.status(500).json({ message: 'Erro Interno do Servidor' })
    }
  }
}

