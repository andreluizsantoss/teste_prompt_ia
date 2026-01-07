import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(1433), // SQL Server default port
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  // CORS
  FRONTEND_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  ACCESS_TOKEN_LIFE: z.string().default('15m'), // Formatos: 15m, 2h, 7d, 30s
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_LIFE: z.string().default('7d'), // Formatos: 15m, 2h, 7d, 30s
  REFRESH_TOKEN_NOT_BEFORE: z.string().default('0'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  const errorMessage = '❌ Invalid environment variables'
  const formattedError = _env.error.format()
  console.error(errorMessage, formattedError)
  throw new Error(errorMessage)
}

export const env = _env.data
