import { Router } from 'express'
import { container } from 'tsyringe'
import { AuthenticateController } from '../controllers/AuthenticateController'
import { UpdateAccessTokenController } from '../controllers/UpdateAccessTokenController'
import { FindUserByTokenController } from '../controllers/FindUserByTokenController'
import { UpdateDeviceTokenController } from '../controllers/UpdateDeviceTokenController'
import { isAuthenticated } from '@shared/middlewares/isAuthenticated'

const authenticationRouter = Router()

const authenticateController = container.resolve(AuthenticateController)
const updateAccessTokenController = container.resolve(
  UpdateAccessTokenController,
)
const findUserByTokenController = container.resolve(FindUserByTokenController)
const updateDeviceTokenController = container.resolve(
  UpdateDeviceTokenController,
)

// POST /api/v1/auth/session - Autenticar usuário (login)
authenticationRouter.post('/session', (request, response) =>
  authenticateController.session(request, response),
)

// POST /api/v1/auth/refresh - Renovar access token usando refresh token
authenticationRouter.post('/refresh', (request, response) =>
  updateAccessTokenController.update(request, response),
)

// GET /api/v1/auth/me - Buscar dados do usuário autenticado (requer autenticação)
authenticationRouter.get('/me', isAuthenticated, (request, response) =>
  findUserByTokenController.show(request, response),
)

// PUT /api/v1/auth/device - Atualizar tokens de dispositivo (iOS/Android) (requer autenticação)
authenticationRouter.put('/device', isAuthenticated, (request, response) =>
  updateDeviceTokenController.update(request, response),
)

export default authenticationRouter
