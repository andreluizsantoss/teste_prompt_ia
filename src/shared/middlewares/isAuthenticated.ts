import { NextFunction, Request, Response } from 'express'
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { authConfig } from '@shared/config/auth'
import { logger } from '@shared/logger/logger'

type JwtPayloadProps = {
  sub: string
  iat?: number
  exp?: number
  iss?: string
}

export const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    logger.warn('Authentication failed: Authorization header not provided.', {
      ip: request.ip,
      path: request.path,
    })
    return unauthorizedResponse(response)
  }

  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    logger.warn('Authentication failed: Bearer token not found in header.', {
      ip: request.ip,
      path: request.path,
    })
    return unauthorizedResponse(response)
  }

  try {
    const decoded = verify(token, authConfig.jwt.secret) as JwtPayloadProps
    request.user = { id: decoded.sub }
    return next()
  } catch (error) {
    let logMessage = 'Access token validation failed.'
    const clientMessage = 'Access token not present or invalid.'
    if (error instanceof TokenExpiredError) {
      logMessage = 'Access token expired.'
    } else if (error instanceof JsonWebTokenError) {
      logMessage = `Access token invalid: ${error.message}.`
    } else if (error instanceof Error) {
      logMessage = `Unexpected error during token validation: ${error.message}`
    }

    logger.error(`Authentication failed: ${logMessage}`, {
      error: {
        message: (error as Error).message,
        stack: (error as Error).stack,
      },
      ip: request.ip,
      path: request.path,
    })

    return unauthorizedResponse(response, clientMessage)
  }
}

// Função auxiliar para padronizar a resposta de "não autorizado"
function unauthorizedResponse(response: Response, clientMessage?: string) {
  return response.status(401).json({
    error: true,
    code: 'token.invalid',
    message: clientMessage || 'Access token not present or invalid',
  })
}

