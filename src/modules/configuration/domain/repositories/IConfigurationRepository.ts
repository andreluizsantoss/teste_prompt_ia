import { IConfiguration } from '@modules/configuration/domain/models/IConfiguration'

export interface IConfigurationRepository {
  findConfiguration(): Promise<IConfiguration | null>
}
