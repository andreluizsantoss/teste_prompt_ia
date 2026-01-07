import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '@shared/errors/AppError'
import { logger } from '@shared/logger/logger'
import { env } from '@shared/env'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Tratamento específico para erros de validação Zod
  if (error instanceof ZodError) {
    logger.warn('Validation error occurred', {
      message: error.message,
      issues: error.format(),
      path: req.path,
      method: req.method,
      ip: req.ip,
      url: req.url,
    })

    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      issues: error.format(),
    })
  }

  // Tratamento para erros customizados da aplicação
  if (error instanceof AppError) {
    logger.warn('Application error occurred', {
      statusCode: error.statusCode,
      message: error.message,
      method: req.method,
      path: req.path,
      url: req.url,
      ip: req.ip,
      userId: (req as any).user?.codigo || 'unknown',
    })

    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  // Tratamento para erros não tratados (500)
  logger.error('Unhandled internal server error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).user?.codigo || 'unknown',
  })

  return res.status(500).json({
    status: 'error',
    message:
      env.ILPI_CONCIERGE_NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
  })
}
