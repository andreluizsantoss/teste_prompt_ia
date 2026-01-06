import { Request, Response, NextFunction } from 'express'

/**
 * Middleware para adicionar headers de versionamento e deprecação da API
 */

interface VersionConfig {
  version: string
  deprecated?: boolean
  sunset?: string // Data de descontinuação (ISO 8601)
  deprecationInfo?: string
}

export const apiVersionMiddleware = (config: VersionConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Adiciona versão atual nos headers da resposta
    res.setHeader('X-API-Version', config.version)

    // Se a versão estiver depreciada, adiciona headers de aviso
    if (config.deprecated) {
      res.setHeader('X-API-Deprecated', 'true')

      if (config.sunset) {
        res.setHeader('X-API-Sunset', config.sunset)
      }

      if (config.deprecationInfo) {
        res.setHeader('X-API-Deprecation-Info', config.deprecationInfo)
      }

      // Adiciona warning header padrão (RFC 7234)
      const warningMessage = config.sunset
        ? `299 - "API version ${config.version} is deprecated and will be removed on ${config.sunset}"`
        : `299 - "API version ${config.version} is deprecated"`

      res.setHeader('Warning', warningMessage)
    }

    next()
  }
}
