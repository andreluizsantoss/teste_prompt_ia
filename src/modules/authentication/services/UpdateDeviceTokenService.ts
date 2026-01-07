import { inject, injectable } from 'tsyringe'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUpdateDeviceTokenInput } from '@modules/authentication/domain/models/IUpdateDeviceTokenInput'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { validateUserPermissions } from '@modules/authentication/utils/validateUser'
import { removeUserSensitiveData } from '@modules/authentication/utils/removeUserSensitiveData'

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

    // Validar permissões do usuário
    validateUserPermissions(user)

    const updatedUser = await this.authenticationRepository.updateDeviceToken({
      codigo: user.codigo,
      iosToken: iosDeviceToken,
      androidToken: androidDeviceToken,
    })

    if (!updatedUser) {
      throw new UserNotFoundError()
    }

    // Remover dados sensíveis antes de retornar
    return removeUserSensitiveData(updatedUser)
  }
}
