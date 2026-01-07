import { AppError } from './AppError'

export class ConfigurationNotFoundError extends AppError {
  constructor() {
    super('Configuração não encontrada.', 404)
    this.name = 'ConfigurationNotFoundError'
  }
}
