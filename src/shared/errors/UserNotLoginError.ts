import { AppError } from './AppError'

export class UserNotLoginError extends AppError {
  constructor() {
    super(
      'Usuário não possui permissão de login. Contate o administrador.',
      403,
    )
  }
}

