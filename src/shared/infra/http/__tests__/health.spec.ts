import request from 'supertest'

// Mock do AppDataSource antes de importar o app
jest.mock('@shared/infra/database/data-source', () => ({
  AppDataSource: {
    isInitialized: true,
    query: jest.fn(),
    initialize: jest.fn(),
    destroy: jest.fn(),
    getRepository: jest.fn(() => ({
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    })),
  },
  initializeDatabase: jest.fn(),
}))

import { app } from '@shared/infra/http/app'
import { AppDataSource } from '@shared/infra/database/data-source'

describe('GET /health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('quando o banco está conectado', () => {
    it('deve retornar status 200 com banco conectado', async () => {
      // Mock de query bem-sucedida
      ;(AppDataSource.query as jest.Mock).mockResolvedValue([{ result: 1 }])
      ;(AppDataSource.isInitialized as any) = true

      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body).toHaveProperty('database')
      expect(response.body.database).toHaveProperty('status', 'connected')
    })

    it('deve retornar estrutura correta da resposta', async () => {
      ;(AppDataSource.query as jest.Mock).mockResolvedValue([{ result: 1 }])
      ;(AppDataSource.isInitialized as any) = true

      const response = await request(app).get('/health')

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body.database).toHaveProperty('status')
    })

    it('deve validar formato do timestamp', async () => {
      ;(AppDataSource.query as jest.Mock).mockResolvedValue([{ result: 1 }])
      ;(AppDataSource.isInitialized as any) = true

      const response = await request(app).get('/health')

      expect(response.body.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      )
    })

    it('deve retornar uptime maior que zero', async () => {
      ;(AppDataSource.query as jest.Mock).mockResolvedValue([{ result: 1 }])
      ;(AppDataSource.isInitialized as any) = true

      const response = await request(app).get('/health')

      expect(response.body.uptime).toBeGreaterThan(0)
    })
  })

  describe('quando o banco está desconectado', () => {
    it('deve retornar status 503 quando query falha', async () => {
      ;(AppDataSource.isInitialized as any) = true
      ;(AppDataSource.query as jest.Mock).mockRejectedValue(
        new Error('Connection lost'),
      )

      const response = await request(app).get('/health')

      expect(response.status).toBe(503)
      expect(response.body).toHaveProperty('status', 'error')
      expect(response.body.database).toHaveProperty('status', 'disconnected')
    })

    it('deve retornar estrutura correta mesmo com erro no banco', async () => {
      ;(AppDataSource.isInitialized as any) = true
      ;(AppDataSource.query as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      )

      const response = await request(app).get('/health')

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body).toHaveProperty('database')
      expect(response.body.database).toHaveProperty('status', 'disconnected')
    })
  })
})
