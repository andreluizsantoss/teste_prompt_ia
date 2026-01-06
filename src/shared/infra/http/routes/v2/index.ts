import { Router } from 'express'
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'

const v2Routes = Router()

// Aplicar middleware de versão
v2Routes.use(
  apiVersionMiddleware({
    version: '2.0',
    deprecated: false,
  }),
)

// Registrar rotas de módulos v2 aqui (futuro)
// v2Routes.use('/users', userRoutesV2)

export { v2Routes }
