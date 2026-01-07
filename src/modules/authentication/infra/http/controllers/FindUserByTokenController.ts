import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { FindUserByTokenService } from '@modules/authentication/services/FindUserByTokenService'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
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

      // Remover dados sensíveis adicionais antes de retornar
      const {
        senha: _senha,
        login: _login,
        androidToken: _androidToken,
        iosToken: _iosToken,
        refreshToken: _refreshToken,
        status: _status,
        foto: _foto,
        ...userPublicData
      } = user

      return response.status(200).json(userPublicData)
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        logger.warn(`Usuário não encontrado para ID: "${userId}"`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(404).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotPermissionError) {
        logger.warn(`Usuário ID: "${userId}": Permissão negada.`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotLoginError) {
        logger.warn(`Autenticação falhou para ID: ${userId}: Login negado.`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      logger.error(
        `Erro inesperado na busca de usuário logado para ID: ${userId}: Erro Interno do Servidor`,
        {
          error: (err as Error).message,
          path: request.path,
        },
      )

      return response.status(500).json({ message: 'Erro Interno do Servidor' })
    }
  }
}
