import 'reflect-metadata'
import { FindConfigurationService } from '../FindConfigurationService'
import { IConfigurationRepository } from '@modules/configuration/domain/repositories/IConfigurationRepository'
import { ConfigurationNotFoundError } from '@shared/errors/ConfigurationNotFoundError'

describe('FindConfigurationService', () => {
  let service: FindConfigurationService
  let mockRepository: jest.Mocked<IConfigurationRepository>

  beforeEach(() => {
    mockRepository = {
      findConfiguration: jest.fn(),
    }
    service = new FindConfigurationService(mockRepository)
  })

  it('deve retornar a configuração quando encontrada', async () => {
    const mockConfiguration = {
      codigo: 1,
      nome: 'ILPI Teste',
      cnpj: '12.345.678/0001-99',
      endereco: 'Rua Teste, 123',
      bairro: 'Centro',
      cep: '12345-678',
      cidade: 'São Paulo',
      estado: 'SP',
      telefone: '(11) 98765-4321',
      email: 'teste@ilpi.com.br',
      sistemaAtendimento: '24h',
    }

    mockRepository.findConfiguration.mockResolvedValue(mockConfiguration)

    const result = await service.execute()

    expect(result).toEqual(mockConfiguration)
    expect(mockRepository.findConfiguration).toHaveBeenCalledTimes(1)
  })

  it('deve lançar ConfigurationNotFoundError quando não encontrar configuração', async () => {
    mockRepository.findConfiguration.mockResolvedValue(null)

    await expect(service.execute()).rejects.toMatchObject({
      message: 'Configuração não encontrada.',
      statusCode: 404,
    })
    expect(mockRepository.findConfiguration).toHaveBeenCalledTimes(1)
  })

  it('deve propagar erros do repositório', async () => {
    const error = new Error('Erro no banco de dados')
    mockRepository.findConfiguration.mockRejectedValue(error)

    await expect(service.execute()).rejects.toThrow(error)
    expect(mockRepository.findConfiguration).toHaveBeenCalledTimes(1)
  })
})

