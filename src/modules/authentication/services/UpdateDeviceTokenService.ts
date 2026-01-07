import { inject, injectable } from 'tsyringe'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUpdateDeviceTokenInput } from '@modules/authentication/domain/models/IUpdateDeviceTokenInput'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'

@injectable()
export class UpdateDeviceTokenService {
  constructor(
    @inject('AuthenticationRepository')
    private authenticationRepository: IAuthenticationRepository,
  ) {}

  async execute({
    userId,
    iosDeviceToken,
    androidDeviceToken,
  }: IUpdateDeviceTokenInput): Promise<IUserResponse> {
    const user = await this.authenticationRepository.findUserById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    // Validar status
    if (user.status !== 'ATIVO' && user.status !== 'Ativo') {
      throw new UserNotPermissionError()
    }

    // Validar permissão de login
    if (user.login === 'NÃO' || user.login === 'Não') {
      throw new UserNotLoginError()
    }

    const updatedUser = await this.authenticationRepository.updateDeviceToken({
      codigo: user.codigo,
      iosToken: iosDeviceToken,
      androidToken: androidDeviceToken,
    })

    if (!updatedUser) {
      throw new UserNotFoundError()
    }

    // Remover dados sensíveis antes de retornar
    const {
      senha: _senha,
      refreshToken: _refreshToken,
      ...userWithoutSensitiveData
    } = updatedUser

    return userWithoutSensitiveData
  }
}
