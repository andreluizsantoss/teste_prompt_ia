import { env } from '@shared/env'

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    accessTokenLife: env.ACCESS_TOKEN_LIFE,
    refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
    refreshTokenLife: env.REFRESH_TOKEN_LIFE,
    refreshTokenNotBefore: env.REFRESH_TOKEN_NOT_BEFORE,
  },
  cookies: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
}
