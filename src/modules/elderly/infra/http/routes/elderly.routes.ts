import { Router } from 'express'
import { container } from 'tsyringe'
import { FindAllElderlysController } from '../controllers/FindAllElderlysController'
import { FindElderlyByIdController } from '../controllers/FindElderlyByIdController'
import { FindAllElderlysWithActiveExitController } from '../controllers/FindAllElderlysWithActiveExitController'
import { FindAllElderlysWithoutActiveExitController } from '../controllers/FindAllElderlysWithoutActiveExitController'
import { isAuthenticated } from '@shared/middlewares/isAuthenticated'

const elderlyRouter = Router()

const findAllElderlysController = container.resolve(FindAllElderlysController)
const findElderlyByIdController = container.resolve(FindElderlyByIdController)
const findAllElderlysWithActiveExitController = container.resolve(
  FindAllElderlysWithActiveExitController,
)
const findAllElderlysWithoutActiveExitController = container.resolve(
  FindAllElderlysWithoutActiveExitController,
)

// GET /api/v1/elderly - Buscar todos os idosos ativos
elderlyRouter.get('/', isAuthenticated, (request, response) =>
  findAllElderlysController.show(request, response),
)

// GET /api/v1/elderly/:id - Buscar idoso por ID
elderlyRouter.get('/:id', isAuthenticated, (request, response) =>
  findElderlyByIdController.show(request, response),
)

// GET /api/v1/elderly/active-exit - Buscar idosos com saída ativa
elderlyRouter.get('/list/active-exit', isAuthenticated, (request, response) =>
  findAllElderlysWithActiveExitController.show(request, response),
)

// GET /api/v1/elderly/available - Buscar idosos disponíveis (sem saída ativa)
elderlyRouter.get('/list/available', isAuthenticated, (request, response) =>
  findAllElderlysWithoutActiveExitController.show(request, response),
)

export default elderlyRouter
