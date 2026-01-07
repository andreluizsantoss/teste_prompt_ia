import { AppError } from './AppError'

export class RefreshTokenInvalidError extends AppError {
  constructor(message = 'Refresh token inválido ou expirado.') {
    super(message, 401)
  }
}

