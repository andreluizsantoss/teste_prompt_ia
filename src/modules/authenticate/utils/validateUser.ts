import { IUserResponse } from '@modules/authenticate/domain/models/IUserResponse'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'

/**
 * Valida se o usuário tem status ativo e permissão de login
 * @param user Objeto de usuário para validar
 * @throws {UserNotPermissionError} Se o status não for ativo
 * @throws {UserNotLoginError} Se o usuário não tiver permissão de login
 */
export function validateUserPermissions(user: IUserResponse): void {
  // Validar status
  if (user.status !== 'ATIVO' && user.status !== 'Ativo') {
    throw new UserNotPermissionError()
  }

  // Validar permissão de login
  if (user.login === 'NÃO' || user.login === 'Não') {
    throw new UserNotLoginError()
  }
}
