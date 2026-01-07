import { AppError } from './AppError'

export class UserNotPermissionError extends AppError {
  constructor() {
    super('Usuário sem permissão de acesso. Contate o administrador.', 403)
    this.name = 'UserNotPermissionError'
  }
}
