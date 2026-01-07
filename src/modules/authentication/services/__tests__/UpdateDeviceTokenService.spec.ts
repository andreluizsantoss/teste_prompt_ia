import 'reflect-metadata'
import { UpdateDeviceTokenService } from '../UpdateDeviceTokenService'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'

describe('UpdateDeviceTokenService', () => {
  let updateDeviceTokenService: UpdateDeviceTokenService
  let mockRepository: jest.Mocked<IAuthenticationRepository>

  beforeEach(() => {
    mockRepository = {
      findUserByCPF: jest.fn(),
      findUserById: jest.fn(),
      saveSession: jest.fn(),
      updateRefreshToken: jest.fn(),
      updateDeviceToken: jest.fn(),
    }

    updateDeviceTokenService = new UpdateDeviceTokenService(mockRepository)
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
      iosToken: 'old-ios-token',
      androidToken: 'old-android-token',
      refreshToken: 'hashed-refresh-token',
    }

    it('deve atualizar tokens de dispositivo com sucesso', async () => {
      const updatedUser = {
        ...validUser,
        iosToken: 'new-ios-token',
        androidToken: 'new-android-token',
      }

      mockRepository.findUserById.mockResolvedValue(validUser)
      mockRepository.updateDeviceToken.mockResolvedValue(updatedUser)

      const result = await updateDeviceTokenService.execute({
        userId: '1',
        iosDeviceToken: 'new-ios-token',
        androidDeviceToken: 'new-android-token',
      })

      expect(result).toBeDefined()
      expect(result).not.toHaveProperty('senha')
      expect(result).not.toHaveProperty('refreshToken')
      expect(mockRepository.findUserById).toHaveBeenCalledWith('1')
      expect(mockRepository.updateDeviceToken).toHaveBeenCalledWith({
        codigo: 1,
        iosToken: 'new-ios-token',
        androidToken: 'new-android-token',
      })
    })

    it('deve atualizar apenas iOS token quando fornecido', async () => {
      const updatedUser = {
        ...validUser,
        iosToken: 'new-ios-token',
      }

      mockRepository.findUserById.mockResolvedValue(validUser)
      mockRepository.updateDeviceToken.mockResolvedValue(updatedUser)

      await updateDeviceTokenService.execute({
        userId: '1',
        iosDeviceToken: 'new-ios-token',
      })

      expect(mockRepository.updateDeviceToken).toHaveBeenCalledWith({
        codigo: 1,
        iosToken: 'new-ios-token',
        androidToken: undefined,
      })
    })

    it('deve atualizar apenas Android token quando fornecido', async () => {
      const updatedUser = {
        ...validUser,
        androidToken: 'new-android-token',
      }

      mockRepository.findUserById.mockResolvedValue(validUser)
      mockRepository.updateDeviceToken.mockResolvedValue(updatedUser)

      await updateDeviceTokenService.execute({
        userId: '1',
        androidDeviceToken: 'new-android-token',
      })

      expect(mockRepository.updateDeviceToken).toHaveBeenCalledWith({
        codigo: 1,
        iosToken: undefined,
        androidToken: 'new-android-token',
      })
    })

    it('deve lançar UserNotFoundError se usuário não for encontrado', async () => {
      mockRepository.findUserById.mockResolvedValue(null)

      await expect(async () => {
        await updateDeviceTokenService.execute({
          userId: '999',
          iosDeviceToken: 'ios-token',
        })
      }).rejects.toThrow(UserNotFoundError)

      expect(mockRepository.findUserById).toHaveBeenCalledWith('999')
      expect(mockRepository.updateDeviceToken).not.toHaveBeenCalled()
    })

    it('deve lançar UserNotPermissionError se usuário não estiver ativo', async () => {
      const inactiveUser = { ...validUser, status: 'INATIVO' }
      mockRepository.findUserById.mockResolvedValue(inactiveUser)

      await expect(async () => {
        await updateDeviceTokenService.execute({
          userId: '1',
          iosDeviceToken: 'ios-token',
        })
      }).rejects.toThrow(UserNotPermissionError)

      expect(mockRepository.updateDeviceToken).not.toHaveBeenCalled()
    })

    it('deve lançar UserNotLoginError se usuário não tiver permissão de login', async () => {
      const userWithoutLogin = { ...validUser, login: 'NÃO' }
      mockRepository.findUserById.mockResolvedValue(userWithoutLogin)

      await expect(async () => {
        await updateDeviceTokenService.execute({
          userId: '1',
          androidDeviceToken: 'android-token',
        })
      }).rejects.toThrow(UserNotLoginError)

      expect(mockRepository.updateDeviceToken).not.toHaveBeenCalled()
    })

    it('deve lançar UserNotFoundError se atualização retornar null', async () => {
      mockRepository.findUserById.mockResolvedValue(validUser)
      mockRepository.updateDeviceToken.mockResolvedValue(null)

      await expect(async () => {
        await updateDeviceTokenService.execute({
          userId: '1',
          iosDeviceToken: 'ios-token',
        })
      }).rejects.toThrow(UserNotFoundError)
    })
  })
})

