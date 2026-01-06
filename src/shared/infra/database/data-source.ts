import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@shared/env'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV === 'dev',
  logging: env.NODE_ENV === 'dev',
  entities: ['src/modules/**/domain/entities/*.ts'],
  subscribers: [],
  charset: 'utf8mb4',
  timezone: 'Z',
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
