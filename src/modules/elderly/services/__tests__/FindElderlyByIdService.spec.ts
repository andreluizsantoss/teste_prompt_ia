import 'reflect-metadata'
import { FindElderlyByIdService } from '../FindElderlyByIdService'
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'

describe('FindElderlyByIdService', () => {
  let service: FindElderlyByIdService
  let mockRepository: jest.Mocked<IElderlyRepository>

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findAllWithActiveExit: jest.fn(),
      findAllWithoutActiveExit: jest.fn(),
    }
    service = new FindElderlyByIdService(mockRepository)
  })

  it('deve retornar o idoso quando encontrado', async () => {
    const mockElderly = {
      codigo: 1,
      nome: 'João Silva',
      apelido: 'Joãozinho',
      status: 'ATIVO',
    }

    mockRepository.findById.mockResolvedValue(mockElderly)

    const result = await service.execute('1')

    expect(result).toEqual(mockElderly)
    expect(mockRepository.findById).toHaveBeenCalledWith('1')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
  })

  it('deve lançar ElderlyNotFoundError quando não encontrar idoso', async () => {
    mockRepository.findById.mockResolvedValue(null)

    await expect(service.execute('999')).rejects.toMatchObject({
      message: 'Idoso não encontrado.',
      statusCode: 404,
    })
    expect(mockRepository.findById).toHaveBeenCalledWith('999')
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
  })

  it('deve propagar erros do repositório', async () => {
    const error = new Error('Erro no banco de dados')
    mockRepository.findById.mockRejectedValue(error)

    await expect(service.execute('1')).rejects.toThrow(error)
    expect(mockRepository.findById).toHaveBeenCalledTimes(1)
  })
})
