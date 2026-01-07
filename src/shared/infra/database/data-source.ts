import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@shared/env'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: false, // Desabilitado para SQL Server em produção
  logging: env.NODE_ENV === 'dev',
  entities: ['src/modules/**/domain/entities/*.ts'],
  subscribers: [],
  options: {
    encrypt: true, // Para Azure SQL
    trustServerCertificate: true, // Para desenvolvimento local
    enableArithAbort: true,
  },
})

// Inicializar conexão
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log('✅ Database connected successfully!')
  } catch (error) {
    console.error('❌ Error connecting to database:', error)
    process.exit(1)
  }
}
