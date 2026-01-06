import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { v1Routes } from './v1'
// import { v2Routes } from './v2'

const routes = Router()

// Health Check (sem versão - sempre disponível)
routes.use(healthRoutes)

// API v1
routes.use('/api/v1', v1Routes)

// Futuras versões aqui
// routes.use('/api/v2', v2Routes)

export { routes }
