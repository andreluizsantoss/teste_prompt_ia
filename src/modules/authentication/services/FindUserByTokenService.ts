import { inject, injectable } from 'tsyringe'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { validateUserPermissions } from '@modules/authentication/utils/validateUser'
import { removeUserSensitiveData } from '@modules/authentication/utils/removeUserSensitiveData'

@injectable()
export class FindUserByTokenService {
  constructor(
    @inject('AuthenticationRepository')
    private authenticationRepository: IAuthenticationRepository,
  ) {}

  async execute(userId: string): Promise<IUserResponse> {
    const user = await this.authenticationRepository.findUserById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    // Validar permissões do usuário
    validateUserPermissions(user)

    // Remover dados sensíveis antes de retornar
    return removeUserSensitiveData(user)
  }
}
