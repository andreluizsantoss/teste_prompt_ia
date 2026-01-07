export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode

    // Mantém o prototype chain correto
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
