import request from 'supertest'
import { app } from '@shared/infra/http/app'
import { AppDataSource } from '@shared/infra/database/data-source'

describe('GET /health', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
  })

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  it('should return health status', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body).toHaveProperty('timezone')
    expect(response.body.timezone).toHaveProperty('offset')
    expect(response.body.timezone).toHaveProperty('description')
    expect(response.body).toHaveProperty('uptime')
    expect(response.body).toHaveProperty('environment')
    expect(response.body).toHaveProperty('database')
    expect(response.body.database).toHaveProperty('status', 'connected')
  })

  it('should return correct structure', async () => {
    const response = await request(app).get('/health')

    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body).toHaveProperty('timezone')
    expect(response.body).toHaveProperty('uptime')
    expect(response.body).toHaveProperty('environment')
    expect(response.body.database).toHaveProperty('status')
  })
})
