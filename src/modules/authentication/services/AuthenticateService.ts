import { sign } from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'
import { authConfig } from '@shared/config/auth'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IAuthenticateResponse } from '@modules/authentication/domain/models/IAuthenticateResponse'
import { IAuthenticateUser } from '@modules/authentication/domain/models/IAuthenticateUser'
import { InvalidCredentialsError } from '@shared/errors/InvalidCredentialsError'
import { validateUserPermissions } from '@modules/authentication/utils/validateUser'

@injectable()
export class AuthenticateService {
  constructor(
    @inject('AuthenticationRepository')
    private authenticationRepository: IAuthenticationRepository,
  ) {}

  async execute({
    cpf,
    senha,
    iosDeviceToken,
    androidDeviceToken,
  }: IAuthenticateUser): Promise<IAuthenticateResponse> {
    const user = await this.authenticationRepository.findUserByCPF(cpf)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Validar senha antes de validar permissões
    if (senha !== user.senha) {
      throw new InvalidCredentialsError()
    }

    // Validar status e permissão de login
    validateUserPermissions(user)

    // Geração do Access Token
    const access_token = sign({}, authConfig.jwt.secret, {
      subject: user.codigo.toString(),
      expiresIn: authConfig.jwt.expiresIn,
      issuer: 'ilpi-portaria-api',
    })

    // Geração do Refresh Token
    const refresh_token = sign({}, authConfig.refreshToken.secret, {
      subject: user.codigo.toString(),
      expiresIn: authConfig.refreshToken.expiresIn,
      notBefore: authConfig.refreshToken.notBefore,
      issuer: 'ilpi-portaria-api',
    })

    // Hashear o Refresh Token antes de salvar no DB
    const hashed_refresh_token = await hash(refresh_token, 8)

    await this.authenticationRepository.saveSession({
      codigo: user.codigo,
      refreshToken: hashed_refresh_token,
      iosToken: iosDeviceToken,
      androidToken: androidDeviceToken,
    })

    return { access_token, refresh_token }
  }
}
