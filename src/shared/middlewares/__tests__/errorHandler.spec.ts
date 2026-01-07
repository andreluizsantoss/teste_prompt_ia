import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'
import { errorHandler } from '../errorHandler'
import { AppError } from '@shared/errors/AppError'
import { logger } from '@shared/logger/logger'

// Mock do logger
jest.mock('@shared/logger/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock do env
jest.mock('@shared/env', () => ({
  env: {
    ILPI_CONCIERGE_NODE_ENV: 'dev',
  },
}))

describe('errorHandler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      method: 'GET',
      ip: '127.0.0.1',
      url: '/test',
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    mockNext = jest.fn()

    jest.clearAllMocks()
  })

  it('should handle ZodError and return 400', () => {
    const schema = z.object({
      email: z.string().email(),
    })

    let zodError: ZodError
    try {
      schema.parse({ email: 'invalid' })
    } catch (error) {
      zodError = error as ZodError
    }

    errorHandler(
      zodError!,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation error',
      issues: expect.any(Object),
    })
    expect(logger.warn).toHaveBeenCalledWith(
      'Validation error occurred',
      expect.objectContaining({
        path: '/test',
        method: 'GET',
        ip: '127.0.0.1',
      }),
    )
  })

  it('should handle AppError and return custom status code', () => {
    const appError = new AppError('Custom error message', 403)

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(mockResponse.status).toHaveBeenCalledWith(403)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Custom error message',
    })
    expect(logger.warn).toHaveBeenCalledWith(
      'Application error occurred',
      expect.objectContaining({
        statusCode: 403,
        message: 'Custom error message',
        path: '/test',
        method: 'GET',
        ip: '127.0.0.1',
      }),
    )
  })

  it('should handle generic Error and return 500', () => {
    const genericError = new Error('Unexpected error')

    errorHandler(
      genericError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Unexpected error',
    })
    expect(logger.error).toHaveBeenCalledWith(
      'Unhandled internal server error',
      expect.objectContaining({
        message: 'Unexpected error',
        path: '/test',
        method: 'GET',
        ip: '127.0.0.1',
      }),
    )
  })

  it('should log userId when available', () => {
    const appError = new AppError('Test error')
    mockRequest = {
      ...mockRequest,
      user: { codigo: 123 },
    } as any

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(logger.warn).toHaveBeenCalledWith(
      'Application error occurred',
      expect.objectContaining({
        userId: 123,
      }),
    )
  })

  it('should log "unknown" when userId is not available', () => {
    const appError = new AppError('Test error')

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(logger.warn).toHaveBeenCalledWith(
      'Application error occurred',
      expect.objectContaining({
        userId: 'unknown',
      }),
    )
  })
})
