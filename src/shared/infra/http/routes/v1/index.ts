import { Router } from 'express'
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'
// import { userRoutes } from '@modules/user/infra/http/routes/user.routes'

const v1Routes = Router()

// Aplicar middleware de versão
v1Routes.use(
  apiVersionMiddleware({
    version: '1.0',
    deprecated: false,
  }),
)

// Registrar rotas de módulos aqui
// v1Routes.use('/users', userRoutes)
// v1Routes.use('/products', productRoutes)

export { v1Routes }
