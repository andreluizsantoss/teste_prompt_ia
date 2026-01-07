import { container } from 'tsyringe'

// Authentication Module
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { AuthenticationRepository } from '@modules/authentication/infra/repositories/AuthenticationRepository'
import { AuthenticateService } from '@modules/authentication/services/AuthenticateService'
import { UpdateAccessTokenService } from '@modules/authentication/services/UpdateAccessTokenService'
import { FindUserByTokenService } from '@modules/authentication/services/FindUserByTokenService'
import { UpdateDeviceTokenService } from '@modules/authentication/services/UpdateDeviceTokenService'

// Configuration Module
import { IConfigurationRepository } from '@modules/configuration/domain/repositories/IConfigurationRepository'
import { ConfigurationRepository } from '@modules/configuration/infra/repositories/ConfigurationRepository'
import { FindConfigurationService } from '@modules/configuration/services/FindConfigurationService'

// Registrar repositórios - Authentication
container.registerSingleton<IAuthenticationRepository>(
  'AuthenticationRepository',
  AuthenticationRepository,
)

// Registrar services - Authentication
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

// Registrar repositórios - Configuration
container.registerSingleton<IConfigurationRepository>(
  'ConfigurationRepository',
  ConfigurationRepository,
)

// Registrar services - Configuration
container.registerSingleton(
  'FindConfigurationService',
  FindConfigurationService,
)

export { container }
