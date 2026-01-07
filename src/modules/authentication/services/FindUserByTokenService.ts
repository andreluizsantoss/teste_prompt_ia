import { inject, injectable } from 'tsyringe'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'

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

    // Validar status
    if (user.status !== 'ATIVO' && user.status !== 'Ativo') {
      throw new UserNotPermissionError()
    }

    // Validar permissão de login
    if (user.login === 'NÃO' || user.login === 'Não') {
      throw new UserNotLoginError()
    }

    // Remover dados sensíveis antes de retornar
    const { senha, refreshToken, ...userWithoutSensitiveData } = user

    return userWithoutSensitiveData
  }
}

