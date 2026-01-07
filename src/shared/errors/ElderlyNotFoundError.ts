import { AppError } from './AppError'

export class ElderlyNotFoundError extends AppError {
  constructor() {
    super('Idoso não encontrado.', 404)
    this.name = 'ElderlyNotFoundError'
  }
}
