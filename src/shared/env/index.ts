import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // Ambiente
  ILPI_CONCIERGE_NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  ILPI_CONCIERGE_PORT: z.coerce.number().default(3333),

  // Permissões e Configurações
  ILPI_CONCIERGE_FRONTEND_PERMISSION: z.string(),
  ILPI_CONCIERGE_KILOMETRAGEM: z.coerce.number().default(0),

  // Database
  ILPI_CONCIERGE_DATABASE_URL: z.string(),
  ILPI_CONCIERGE_DB_ENCRYPT: z
    .string()
    .optional()
    .default('false')
    .transform(val => val === 'true'),
  ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE: z
    .string()
    .optional()
    .default('true')
    .transform(val => val === 'true'),

  // JWT
  ILPI_CONCIERGE_JWT_SECRET: z.string().min(32),
  ILPI_CONCIERGE_ACCESS_TOKEN_LIFE: z.string().default('15m'),
  ILPI_CONCIERGE_REFRESH_TOKEN_SECRET: z.string().min(32),
  ILPI_CONCIERGE_REFRESH_TOKEN_LIFE: z.string().default('7d'),
  ILPI_CONCIERGE_REFRESH_TOKEN_NOT_BEFORE: z.string().default('0'),
  ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS: z.string().default('604800000'),

  // Email
  ILPI_CONCIERGE_MAIL_DRIVER: z.string().default('ethereal'),
  ILPI_CONCIERGE_HOST_EMAIL: z.string().default('smtp.ethereal.email'),
  ILPI_CONCIERGE_NAME_EMAIL: z.string().default('ILPI Portaria'),
  ILPI_CONCIERGE_CREDENTIAL_EMAIL: z.string(),
  ILPI_CONCIERGE_CREDENTIAL_PASSWORD: z.string(),
  ILPI_CONCIERGE_PORT_EMAIL: z.coerce.number().default(587),

  // Google Application Credentials
  ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  const errorMessage = '❌ Invalid environment variables'
  const formattedError = _env.error.format()
  console.error(errorMessage, formattedError)
  throw new Error(errorMessage)
}

// Configurar credenciais do Google se fornecidas
if (_env.data.ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    _env.data.ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS
}

export const env = _env.data
