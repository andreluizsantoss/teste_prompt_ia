import { container } from 'tsyringe'

// Authentication Module
import { IAuthenticationRepository } from '@modules/authenticate/domain/repositories/IAuthenticationRepository'
import { AuthenticationRepository } from '@modules/authenticate/infra/repositories/AuthenticationRepository'
import { AuthenticateService } from '@modules/authenticate/services/AuthenticateService'
import { UpdateAccessTokenService } from '@modules/authenticate/services/UpdateAccessTokenService'
import { FindUserByTokenService } from '@modules/authenticate/services/FindUserByTokenService'
import { UpdateDeviceTokenService } from '@modules/authenticate/services/UpdateDeviceTokenService'

// Configuration Module
import { IConfigurationRepository } from '@modules/configuration/domain/repositories/IConfigurationRepository'
import { ConfigurationRepository } from '@modules/configuration/infra/repositories/ConfigurationRepository'
import { FindConfigurationService } from '@modules/configuration/services/FindConfigurationService'

// Elderly Module
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'
import { ElderlyRepository } from '@modules/elderly/infra/repositories/ElderlyRepository'
import { FindAllElderlysService } from '@modules/elderly/services/FindAllElderlysService'
import { FindElderlyByIdService } from '@modules/elderly/services/FindElderlyByIdService'
import { FindAllElderlysWithActiveExitService } from '@modules/elderly/services/FindAllElderlysWithActiveExitService'
import { FindAllElderlysWithoutActiveExitService } from '@modules/elderly/services/FindAllElderlysWithoutActiveExitService'

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

// Registrar repositórios - Elderly
container.registerSingleton<IElderlyRepository>(
  'ElderlyRepository',
  ElderlyRepository,
)

// Registrar services - Elderly
container.registerSingleton('FindAllElderlysService', FindAllElderlysService)
container.registerSingleton('FindElderlyByIdService', FindElderlyByIdService)
container.registerSingleton(
  'FindAllElderlysWithActiveExitService',
  FindAllElderlysWithActiveExitService,
)
container.registerSingleton(
  'FindAllElderlysWithoutActiveExitService',
  FindAllElderlysWithoutActiveExitService,
)

export { container }
