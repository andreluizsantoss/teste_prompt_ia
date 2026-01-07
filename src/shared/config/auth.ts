import { env } from '@shared/env'

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.ACCESS_TOKEN_LIFE,
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_LIFE,
    notBefore: env.REFRESH_TOKEN_NOT_BEFORE,
  },
}
