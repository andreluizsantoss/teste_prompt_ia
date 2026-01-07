import { AppError } from './AppError'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('CPF ou senha incorretos.', 401)
  }
}
