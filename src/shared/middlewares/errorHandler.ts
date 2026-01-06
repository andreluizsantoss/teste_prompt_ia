import { Request, Response, NextFunction } from 'express'
import { AppError } from '@shared/errors/AppError'
import { logger } from '@shared/logger/logger'
import { env } from '@shared/env'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    logger.warn({
      statusCode: error.statusCode,
      message: error.message,
      method: req.method,
      url: req.url,
    })

    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
  })

  return res.status(500).json({
    status: 'error',
    message:
      env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
  })
}
