import 'reflect-metadata'
import { FindUserByTokenService } from '../FindUserByTokenService'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'

describe('FindUserByTokenService', () => {
  let findUserByTokenService: FindUserByTokenService
  let mockRepository: jest.Mocked<IAuthenticationRepository>

  beforeEach(() => {
    mockRepository = {
      findUserByCPF: jest.fn(),
      findUserById: jest.fn(),
      saveSession: jest.fn(),
      updateRefreshToken: jest.fn(),
      updateDeviceToken: jest.fn(),
    }

    findUserByTokenService = new FindUserByTokenService(mockRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    const validUser: IUserResponse = {
      codigo: 1,
      nome: 'Test User',
      cpf: '12345678901',
      email: 'test@example.com',
      cargo: 'Desenvolvedor',
      login: 'SIM',
      senha: 'senha123',
      status: 'ATIVO',
      refreshToken: 'hashed-refresh-token',
    }

    it('deve retornar usuário sem dados sensíveis quando encontrado', async () => {
      mockRepository.findUserById.mockResolvedValue(validUser)

      const result = await findUserByTokenService.execute('1')

      expect(result).toBeDefined()
      expect(result.codigo).toBe(1)
      expect(result.nome).toBe('Test User')
      expect(result.cpf).toBe('12345678901')
      expect(result).not.toHaveProperty('senha')
      expect(result).not.toHaveProperty('refreshToken')
      expect(mockRepository.findUserById).toHaveBeenCalledWith('1')
    })

    it('deve lançar UserNotFoundError se usuário não for encontrado', async () => {
      mockRepository.findUserById.mockResolvedValue(null)

      await expect(async () => {
        await findUserByTokenService.execute('999')
      }).rejects.toThrow('Usuário não encontrado.')

      expect(mockRepository.findUserById).toHaveBeenCalledWith('999')
    })

    it('deve lançar UserNotPermissionError se usuário não estiver ativo', async () => {
      const inactiveUser = { ...validUser, status: 'INATIVO' }
      mockRepository.findUserById.mockResolvedValue(inactiveUser)

      await expect(async () => {
        await findUserByTokenService.execute('1')
      }).rejects.toThrow(
        'Usuário sem permissão de acesso. Contate o administrador.',
      )
    })

    it('deve lançar UserNotLoginError se usuário não tiver permissão de login', async () => {
      const userWithoutLogin = { ...validUser, login: 'NÃO' }
      mockRepository.findUserById.mockResolvedValue(userWithoutLogin)

      await expect(async () => {
        await findUserByTokenService.execute('1')
      }).rejects.toThrow(
        'Usuário não possui permissão de login. Contate o administrador.',
      )
    })

    it('deve aceitar status "Ativo" (com maiúscula)', async () => {
      const userWithAtivoStatus = { ...validUser, status: 'Ativo' }
      mockRepository.findUserById.mockResolvedValue(userWithAtivoStatus)

      const result = await findUserByTokenService.execute('1')

      expect(result).toBeDefined()
      expect(result.codigo).toBe(1)
    })

    it('deve aceitar login "Sim" (com maiúsculas variadas)', async () => {
      const userWithSimLogin = { ...validUser, login: 'Sim' }
      mockRepository.findUserById.mockResolvedValue(userWithSimLogin)

      const result = await findUserByTokenService.execute('1')

      expect(result).toBeDefined()
      expect(result.codigo).toBe(1)
    })
  })
})
