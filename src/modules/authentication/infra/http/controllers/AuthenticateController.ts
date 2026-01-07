import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { AuthenticateService } from '@modules/authentication/services/AuthenticateService'
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
        .max(32, 'Senha deve ter no máximo 32 caracteres.')
        .regex(/^\S+$/, 'Senha não de conter espaços.'),
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
      const error = err as Error & { statusCode?: number }

      // Verifica se é um erro customizado da aplicação (AppError)
      if (error.statusCode) {
        // Log apropriado baseado no tipo de erro
        if (error.statusCode === 401) {
          logger.warn(
            `Autenticação falhou para CPF: ${cpf}: Credenciais inválidas.`,
            { path: request.path },
          )
        } else if (error.statusCode === 403) {
          logger.warn(
            `Autenticação falhou para CPF: ${cpf}: Permissão negada.`,
            { path: request.path },
          )
        }

        return response.status(error.statusCode).json({
          message: error.message,
        })
      }

      // Erro inesperado (não é AppError)
      logger.error(`Erro inesperado na autenticação para CPF: ${cpf}`, {
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
