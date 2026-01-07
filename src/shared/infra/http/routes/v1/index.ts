import { Router } from 'express'
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'
import authenticationRouter from '@modules/authenticate/infra/http/routes/authentication.routes'
import configurationRouter from '@modules/configuration/infra/http/routes/configuration.routes'
import elderlyRouter from '@modules/elderly/infra/http/routes/elderly.routes'

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
v1Routes.use('/configuration', configurationRouter)
v1Routes.use('/elderly', elderlyRouter)

export { v1Routes }
