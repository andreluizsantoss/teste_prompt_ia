import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'

/**
 * Remove dados sensíveis do objeto de usuário antes de retornar ao cliente
 * @param user Objeto de usuário completo
 * @returns Objeto de usuário sem dados sensíveis
 */
export function removeUserSensitiveData(user: IUserResponse) {
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

  return userPublicData
}
