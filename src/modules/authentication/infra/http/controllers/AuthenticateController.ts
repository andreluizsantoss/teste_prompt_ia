import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { AuthenticateService } from '@modules/authentication/services/AuthenticateService'
import { InvalidCredentialsError } from '@shared/errors/InvalidCredentialsError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
import { logger } from '@shared/logger/logger'

@injectable()
export class AuthenticateController {
  constructor(
    @inject('AuthenticateService')
    private service: AuthenticateService,
  ) {}

  public async session(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const bodySchema = z.object({
      cpf: z.string().min(11, 'CPF deve ter no mínimo 11 caracteres.'),
      password: z
        .string()
        .min(3, 'Senha deve ter no mínimo 3 caracteres.')
        .max(32, 'Senha deve ter no máximo 32 caracteres.'),
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

    const { cpf, password, iosDeviceToken, androidDeviceToken } =
      parseResult.data

    try {
      const { access_token, refresh_token } = await this.service.execute({
        cpf,
        senha: password,
        iosDeviceToken,
        androidDeviceToken,
      })

      logger.info(`CPF: ${cpf} autenticado com sucesso.`, {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
      })

      return response.status(200).json({
        access_token,
        refresh_token,
      })
    } catch (err) {
      if (err instanceof UserNotPermissionError) {
        logger.warn(`Autenticação falhou para CPF: ${cpf}: Permissão negada.`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      if (err instanceof InvalidCredentialsError) {
        logger.warn(
          `Autenticação falhou para CPF: ${cpf}: Credenciais inválidas.`,
          { error: (err as Error).message, path: request.path },
        )
        return response.status(400).json({ message: (err as Error).message })
      }

      if (err instanceof UserNotLoginError) {
        logger.warn(`Autenticação falhou para CPF: ${cpf}: Login negado.`, {
          error: (err as Error).message,
          path: request.path,
        })
        return response.status(403).json({ message: (err as Error).message })
      }

      logger.error(
        `Erro inesperado na autenticação para CPF: ${cpf}: Erro Interno do Servidor`,
        {
          error: (err as Error).message,
          path: request.path,
        },
      )

      return response.status(500).json({ message: 'Erro Interno do Servidor' })
    }
  }
}
