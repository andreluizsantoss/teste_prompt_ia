import { inject, injectable } from 'tsyringe'
import { IConfigurationRepository } from '@modules/configuration/domain/repositories/IConfigurationRepository'
import { IConfiguration } from '@modules/configuration/domain/models/IConfiguration'
import { ConfigurationNotFoundError } from '@shared/errors/ConfigurationNotFoundError'

@injectable()
export class FindConfigurationService {
  constructor(
    @inject('ConfigurationRepository')
    private configurationRepository: IConfigurationRepository,
  ) {}

  async execute(): Promise<IConfiguration> {
    const configuration = await this.configurationRepository.findConfiguration()

    if (!configuration) {
      throw new ConfigurationNotFoundError()
    }

    return configuration
  }
}
