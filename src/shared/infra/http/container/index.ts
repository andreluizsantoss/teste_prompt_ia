import { container } from 'tsyringe'

// Authentication Module
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { AuthenticationRepository } from '@modules/authentication/infra/repositories/AuthenticationRepository'
import { AuthenticateService } from '@modules/authentication/services/AuthenticateService'
import { UpdateAccessTokenService } from '@modules/authentication/services/UpdateAccessTokenService'
import { FindUserByTokenService } from '@modules/authentication/services/FindUserByTokenService'
import { UpdateDeviceTokenService } from '@modules/authentication/services/UpdateDeviceTokenService'

// Registrar repositórios
container.registerSingleton<IAuthenticationRepository>(
  'AuthenticationRepository',
  AuthenticationRepository,
)

// Registrar services
container.registerSingleton('AuthenticateService', AuthenticateService)
container.registerSingleton(
  'UpdateAccessTokenService',
  UpdateAccessTokenService,
)
container.registerSingleton('FindUserByTokenService', FindUserByTokenService)
container.registerSingleton(
  'UpdateDeviceTokenService',
  UpdateDeviceTokenService,
)

export { container }
