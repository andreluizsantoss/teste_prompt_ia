import { AppError } from './AppError'

export class RefreshTokenRequiredError extends AppError {
  constructor(message = 'Refresh token é obrigatório.') {
    super(message, 400)
    this.name = 'RefreshTokenRequiredError'
  }
}
