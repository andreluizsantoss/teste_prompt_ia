import 'reflect-metadata'
import { FindAllElderlysService } from '../FindAllElderlysService'
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'

describe('FindAllElderlysService', () => {
  let service: FindAllElderlysService
  let mockRepository: jest.Mocked<IElderlyRepository>

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllWithActiveExit: jest.fn(),
      findAllWithoutActiveExit: jest.fn(),
    }
    service = new FindAllElderlysService(mockRepository)
  })

  it('deve retornar todos os idosos ativos', async () => {
    const mockElderlys = [
      { codigo: 1, nome: 'João Silva', apelido: 'Joãozinho', status: 'ATIVO' },
      { codigo: 2, nome: 'Maria Santos', apelido: 'Mari', status: 'ATIVO' },
    ]

    mockRepository.findAll.mockResolvedValue(mockElderlys)

    const result = await service.execute()

    expect(result).toEqual(mockElderlys)
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('deve retornar array vazio quando não houver idosos', async () => {
    mockRepository.findAll.mockResolvedValue([])

    const result = await service.execute()

    expect(result).toEqual([])
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('deve propagar erros do repositório', async () => {
    const error = new Error('Erro no banco de dados')
    mockRepository.findAll.mockRejectedValue(error)

    await expect(service.execute()).rejects.toThrow(error)
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
