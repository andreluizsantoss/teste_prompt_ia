import { env } from '@shared/env'

export const authConfig = {
  jwt: {
    secret: env.ILPI_CONCIERGE_JWT_SECRET,
    expiresIn: env.ILPI_CONCIERGE_ACCESS_TOKEN_LIFE,
  },
  refreshToken: {
    secret: env.ILPI_CONCIERGE_REFRESH_TOKEN_SECRET,
    expiresIn: env.ILPI_CONCIERGE_REFRESH_TOKEN_LIFE,
    notBefore: env.ILPI_CONCIERGE_REFRESH_TOKEN_NOT_BEFORE,
    lifeMs: env.ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS,
  },
}
