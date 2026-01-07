import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@shared/env'
import { logger } from '@shared/logger/logger'

// Parser da DATABASE_URL
// Formato: mssql://username:password@host:port/database
// ou: mssql://username@host:port/database (sem senha)
// NOTA: Caracteres especiais no username/password devem ser URL-encoded
function parseDatabaseUrl(url: string) {
  // Regex que aceita com ou sem senha
  const regexWithPassword = /^mssql:\/\/([^:@]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
  const regexWithoutPassword = /^mssql:\/\/([^@]+)@([^:]+):(\d+)\/(.+)$/

  let match = url.match(regexWithPassword)

  if (match) {
    return {
      username: decodeURIComponent(match[1]),
      password: decodeURIComponent(match[2]),
      host: match[3],
      port: parseInt(match[4], 10),
      database: match[5],
    }
  }

  match = url.match(regexWithoutPassword)

  if (match) {
    return {
      username: decodeURIComponent(match[1]),
      password: '',
      host: match[2],
      port: parseInt(match[3], 10),
      database: match[4],
    }
  }

  throw new Error(
    'DATABASE_URL inválida. Formato esperado: mssql://username:password@host:port/database\n' +
      'IMPORTANTE: Caracteres especiais (!, #, @, etc.) devem ser URL-encoded.\n' +
      'Use o script: node scripts/encode-db-credentials.js',
  )
}

const dbConfig = parseDatabaseUrl(env.ILPI_CONCIERGE_DATABASE_URL)

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,

  // IMPORTANTE: synchronize: false
  // Com false, o TypeORM NUNCA vai alterar a estrutura do banco de dados
  // Isso garante que as tabelas permanecem intactas em DEV e PRODUÇÃO
  // Para alterações de schema, use migrations ou scripts SQL manuais
  synchronize: false,

  logging: env.ILPI_CONCIERGE_NODE_ENV === 'dev',
  entities: ['src/modules/**/domain/entities/*.ts'],
  subscribers: [],
  options: {
    // Configurações de segurança SSL/TLS
    encrypt: env.ILPI_CONCIERGE_DB_ENCRYPT,
    trustServerCertificate: env.ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE,
    enableArithAbort: true,

    // Configurações de conexão e timeout
    connectTimeout: 30000, // 30 segundos para estabelecer conexão
  },
})

// Inicializar conexão
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    logger.info('💾 Database connected successfully!')
  } catch (error) {
    logger.error('❌ Error connecting to database:', error)
    process.exit(1)
  }
}
