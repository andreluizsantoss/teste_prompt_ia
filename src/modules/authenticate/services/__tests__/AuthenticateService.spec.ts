import 'reflect-metadata'
import { AuthenticateService } from '../AuthenticateService'
import { IAuthenticationRepository } from '@modules/authenticate/domain/repositories/IAuthenticationRepository'
import { IUserResponse } from '@modules/authenticate/domain/models/IUserResponse'

describe('AuthenticateService', () => {
  let authenticateService: AuthenticateService
  let mockRepository: jest.Mocked<IAuthenticationRepository>

  beforeEach(() => {
    mockRepository = {
      findUserByCPF: jest.fn(),
      findUserById: jest.fn(),
      saveSession: jest.fn(),
      updateRefreshToken: jest.fn(),
      updateDeviceToken: jest.fn(),
    }

    authenticateService = new AuthenticateService(mockRepository)
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
      iosToken: undefined,
      androidToken: undefined,
      refreshToken: undefined,
    }

    it('deve autenticar um usuário com credenciais válidas', async () => {
      mockRepository.findUserByCPF.mockResolvedValue(validUser)
      mockRepository.saveSession.mockResolvedValue()

      const result = await authenticateService.execute({
        cpf: '12345678901',
        senha: 'senha123',
        iosDeviceToken: 'ios-token-123',
        androidDeviceToken: 'android-token-123',
      })

      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
      expect(result.access_token).toBeTruthy()
      expect(result.refresh_token).toBeTruthy()
      expect(mockRepository.findUserByCPF).toHaveBeenCalledWith('12345678901')
      expect(mockRepository.saveSession).toHaveBeenCalled()
    })

    it('deve lançar InvalidCredentialsError se o usuário não for encontrado', async () => {
      mockRepository.findUserByCPF.mockResolvedValue(null)

      try {
        await authenticateService.execute({
          cpf: '12345678901',
          senha: 'senha123',
        })
        fail('Deveria ter lançado InvalidCredentialsError')
      } catch (error: any) {
        expect(error.message).toBe('CPF ou senha incorretos.')
        expect(error.statusCode).toBe(401)
      }

      expect(mockRepository.findUserByCPF).toHaveBeenCalledWith('12345678901')
      expect(mockRepository.saveSession).not.toHaveBeenCalled()
    })

    it('deve lançar UserNotPermissionError se o usuário não estiver ativo', async () => {
      const inactiveUser = { ...validUser, status: 'INATIVO' }
      mockRepository.findUserByCPF.mockResolvedValue(inactiveUser)

      try {
        await authenticateService.execute({
          cpf: '12345678901',
          senha: 'senha123',
        })
        fail('Deveria ter lançado UserNotPermissionError')
      } catch (error: any) {
        expect(error.message).toBe(
          'Usuário sem permissão de acesso. Contate o administrador.',
        )
        expect(error.statusCode).toBe(403)
      }

      expect(mockRepository.findUserByCPF).toHaveBeenCalledWith('12345678901')
      expect(mockRepository.saveSession).not.toHaveBeenCalled()
    })

    it('deve lançar UserNotLoginError se o usuário não tiver permissão de login', async () => {
      const userWithoutLogin = { ...validUser, login: 'NÃO' }
      mockRepository.findUserByCPF.mockResolvedValue(userWithoutLogin)

      try {
        await authenticateService.execute({
          cpf: '12345678901',
          senha: 'senha123',
        })
        fail('Deveria ter lançado UserNotLoginError')
      } catch (error: any) {
        expect(error.message).toBe(
          'Usuário não possui permissão de login. Contate o administrador.',
        )
        expect(error.statusCode).toBe(403)
      }

      expect(mockRepository.findUserByCPF).toHaveBeenCalledWith('12345678901')
      expect(mockRepository.saveSession).not.toHaveBeenCalled()
    })

    it('deve lançar InvalidCredentialsError se a senha estiver incorreta', async () => {
      mockRepository.findUserByCPF.mockResolvedValue(validUser)

      try {
        await authenticateService.execute({
          cpf: '12345678901',
          senha: 'senhaerrada',
        })
        fail('Deveria ter lançado InvalidCredentialsError')
      } catch (error: any) {
        expect(error.message).toBe('CPF ou senha incorretos.')
        expect(error.statusCode).toBe(401)
      }

      expect(mockRepository.findUserByCPF).toHaveBeenCalledWith('12345678901')
      expect(mockRepository.saveSession).not.toHaveBeenCalled()
    })

    it('deve salvar tokens de dispositivo quando fornecidos', async () => {
      mockRepository.findUserByCPF.mockResolvedValue(validUser)
      mockRepository.saveSession.mockResolvedValue()

      await authenticateService.execute({
        cpf: '12345678901',
        senha: 'senha123',
        iosDeviceToken: 'ios-token',
        androidDeviceToken: 'android-token',
      })

      expect(mockRepository.saveSession).toHaveBeenCalledWith(
        expect.objectContaining({
          codigo: 1,
          iosToken: 'ios-token',
          androidToken: 'android-token',
          refreshToken: expect.any(String),
        }),
      )
    })

    it('deve aceitar status "Ativo" (com maiúscula)', async () => {
      const userWithAtivoStatus = { ...validUser, status: 'Ativo' }
      mockRepository.findUserByCPF.mockResolvedValue(userWithAtivoStatus)
      mockRepository.saveSession.mockResolvedValue()

      const result = await authenticateService.execute({
        cpf: '12345678901',
        senha: 'senha123',
      })

      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
    })
  })
})
