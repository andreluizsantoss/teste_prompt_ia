import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { UpdateAccessTokenService } from '@modules/authentication/services/UpdateAccessTokenService'
import { RefreshTokenInvalidError } from '@shared/errors/RefreshTokenInvalidError'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
import { logger } from '@shared/logger/logger'

@injectable()
export class UpdateAccessTokenController {
  constructor(
    @inject('UpdateAccessTokenService')
    private service: UpdateAccessTokenService,
  ) {}

  public async update(
    request: Request,
    response: Response,
  ): Promise<Response> {
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
      if (err instanceof RefreshTokenInvalidError) {
        logger.warn('Atualização de token falhou: Refresh token inválido.', {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(401).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotFoundError) {
        logger.warn('Atualização de token falhou: Usuário não encontrado.', {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(404).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotLoginError) {
        logger.warn('Atualização de token falhou: Login negado.', {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotPermissionError) {
        logger.warn('Atualização de token falhou: Permissão negada.', {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      logger.error(
        'Erro inesperado na atualização de token: Erro Interno do Servidor',
        {
          error: (err as Error).message,
          path: request.path,
        },
      )

      return response.status(500).json({ message: 'Erro Interno do Servidor' })
    }
  }
}

