import { injectable } from 'tsyringe'
import { AppDataSource } from '@shared/infra/database/data-source'
import { Configuracao } from '@modules/configuration/domain/entities/Configuracao'
import { IConfigurationRepository } from '@modules/configuration/domain/repositories/IConfigurationRepository'
import { IConfiguration } from '@modules/configuration/domain/models/IConfiguration'

@injectable()
export class ConfigurationRepository implements IConfigurationRepository {
  private repository = AppDataSource.getRepository(Configuracao)

  async findConfiguration(): Promise<IConfiguration | null> {
    try {
      const configuracao = await this.repository.findOne({
        where: {},
        order: { codigo: 'ASC' },
      })

      if (!configuracao) {
        return null
      }

      return this.mapToConfiguration(configuracao)
    } catch (error) {
      console.error('Erro ao buscar configuração:', error)
      throw error
    }
  }

  private mapToConfiguration(configuracao: Configuracao): IConfiguration {
    return {
      codigo: configuracao.codigo,
      nome: configuracao.nome,
      cnpj: configuracao.cnpj,
      endereco: configuracao.endereco,
      bairro: configuracao.bairro,
      cep: configuracao.cep,
      cidade: configuracao.cidade,
      estado: configuracao.estado,
      telefone: configuracao.telefone,
      email: configuracao.email,
      sistemaAtendimento: configuracao.sistemaAtendimento,
      logoEmpresa: configuracao.logoEmpresa,
    }
  }
}
