import { Router } from 'express'
import { HealthController } from '../controllers/health_controller'

const healthRoutes = Router()
const healthController = new HealthController()

healthRoutes.get('/health', healthController.check.bind(healthController))

export { healthRoutes }
