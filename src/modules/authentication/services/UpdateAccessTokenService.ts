import { sign, verify } from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'
import { authConfig } from '@shared/config/auth'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IAuthenticateResponse } from '@modules/authentication/domain/models/IAuthenticateResponse'
import { IUpdateTokenInput } from '@modules/authentication/domain/models/IUpdateTokenInput'
import { RefreshTokenInvalidError } from '@shared/errors/RefreshTokenInvalidError'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'

type JwtPayloadProps = {
  sub: string
  exp: number
  nbf?: number
  iat?: number
  iss?: string
}

@injectable()
export class UpdateAccessTokenService {
  constructor(
    @inject('AuthenticationRepository')
    private authenticationRepository: IAuthenticationRepository,
  ) {}

  async execute({
    refreshToken,
  }: IUpdateTokenInput): Promise<IAuthenticateResponse> {
    let decodedRefreshToken: JwtPayloadProps
    let userId: string

    try {
      // Verificar a validade do Refresh Token usando o segredo
      decodedRefreshToken = verify(
        refreshToken,
        authConfig.refreshToken.secret,
      ) as JwtPayloadProps
      userId = decodedRefreshToken.sub
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new RefreshTokenInvalidError('Refresh token expired.')
        }
        if (error.name === 'JsonWebTokenError') {
          throw new RefreshTokenInvalidError(
            `Invalid refresh token: ${error.message}.`,
          )
        }
      }
      throw new RefreshTokenInvalidError('Refresh token verification failed.')
    }

    const user = await this.authenticationRepository.findUserById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (user.status !== 'ATIVO' && user.status !== 'Ativo') {
      throw new UserNotPermissionError()
    }

    if (user.login === 'NÃO' || user.login === 'Não') {
      throw new UserNotLoginError()
    }

    if (!user.refreshToken) {
      throw new RefreshTokenInvalidError(
        'No stored refresh token found for user. Please log in again.',
      )
    }

    // Comparar o Refresh Token recebido com o hash armazenado no DB
    const isRefreshTokenValid = await compare(refreshToken, user.refreshToken)

    if (!isRefreshTokenValid) {
      throw new RefreshTokenInvalidError(
        'Refresh token provided does not match stored token.',
      )
    }

    // Gerar novos Access Token e Refresh Token
    const subjectId = user.codigo.toString()

    const newAccessToken = sign({}, authConfig.jwt.secret, {
      subject: subjectId,
      expiresIn: authConfig.jwt.expiresIn,
      issuer: 'ilpi-portaria-api',
    })

    const newRefreshToken = sign({}, authConfig.refreshToken.secret, {
      subject: subjectId,
      expiresIn: authConfig.refreshToken.expiresIn,
      notBefore: authConfig.refreshToken.notBefore,
      issuer: 'ilpi-portaria-api',
    })

    // Hashear o novo refresh token antes de salvar no banco de dados
    const hashed_new_refresh_token = await hash(newRefreshToken, 8)

    await this.authenticationRepository.updateRefreshToken({
      codigo: user.codigo,
      refreshToken: hashed_new_refresh_token,
    })

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    }
  }
}

