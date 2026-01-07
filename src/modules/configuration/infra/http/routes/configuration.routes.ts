import { Router } from 'express'
import { container } from 'tsyringe'
import { FindConfigurationController } from '../controllers/FindConfigurationController'
import { isAuthenticated } from '@shared/middlewares/isAuthenticated'

const configurationRouter = Router()

const findConfigurationController = container.resolve(
  FindConfigurationController,
)

// GET /api/v1/configuration - Buscar configuração do sistema (requer autenticação)
configurationRouter.get('/', isAuthenticated, (request, response) =>
  findConfigurationController.show(request, response),
)

export default configurationRouter
