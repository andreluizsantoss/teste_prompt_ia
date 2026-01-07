import { Router } from 'express'
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'
import authenticationRouter from '@modules/authentication/infra/http/routes/authentication.routes'

const v1Routes = Router()

// Aplicar middleware de versão
v1Routes.use(
  apiVersionMiddleware({
    version: '1.0',
    deprecated: false,
  }),
)

// Registrar rotas de módulos aqui
v1Routes.use('/auth', authenticationRouter)

export { v1Routes }
