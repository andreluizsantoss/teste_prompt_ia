import 'reflect-metadata'
import { UpdateAccessTokenService } from '../UpdateAccessTokenService'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { RefreshTokenInvalidError } from '@shared/errors/RefreshTokenInvalidError'
import { UserNotFoundError } from '@shared/errors/UserNotFoundError'
import { UserNotLoginError } from '@shared/errors/UserNotLoginError'
import { UserNotPermissionError } from '@shared/errors/UserNotPermissionError'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'
import { sign } from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { authConfig } from '@shared/config/auth'

describe('UpdateAccessTokenService', () => {
  let updateAccessTokenService: UpdateAccessTokenService
  let mockRepository: jest.Mocked<IAuthenticationRepository>

  beforeEach(() => {
    mockRepository = {
      findUserByCPF: jest.fn(),
      findUserById: jest.fn(),
      saveSession: jest.fn(),
      updateRefreshToken: jest.fn(),
      updateDeviceToken: jest.fn(),
    }

    updateAccessTokenService = new UpdateAccessTokenService(mockRepository)
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
      refreshToken: '',
    }

    let validRefreshToken: string
    let hashedRefreshToken: string

    beforeEach(async () => {
      validRefreshToken = sign({}, authConfig.refreshToken.secret, {
        subject: '1',
        expiresIn: authConfig.refreshToken.expiresIn,
        issuer: 'ilpi-portaria-api',
      })
      hashedRefreshToken = await hash(validRefreshToken, 8)
    })

    it('deve renovar tokens com refresh token válido', async () => {
      const userWithRefreshToken = {
        ...validUser,
        refreshToken: hashedRefreshToken,
      }
      mockRepository.findUserById.mockResolvedValue(userWithRefreshToken)
      mockRepository.updateRefreshToken.mockResolvedValue()

      const result = await updateAccessTokenService.execute({
        refreshToken: validRefreshToken,
      })

      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
      expect(result.access_token).toBeTruthy()
      expect(result.refresh_token).toBeTruthy()
      expect(mockRepository.findUserById).toHaveBeenCalledWith('1')
      expect(mockRepository.updateRefreshToken).toHaveBeenCalled()
    })

    it('deve lançar RefreshTokenInvalidError com token inválido', async () => {
      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: 'token-invalido',
        })
      }).rejects.toThrow(RefreshTokenInvalidError)

      expect(mockRepository.findUserById).not.toHaveBeenCalled()
    })

    it('deve lançar RefreshTokenInvalidError com token expirado', async () => {
      const expiredToken = sign({}, authConfig.refreshToken.secret, {
        subject: '1',
        expiresIn: '-1s',
        issuer: 'ilpi-portaria-api',
      })

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: expiredToken,
        })
      }).rejects.toThrow(RefreshTokenInvalidError)
    })

    it('deve lançar UserNotFoundError se usuário não for encontrado', async () => {
      mockRepository.findUserById.mockResolvedValue(null)

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: validRefreshToken,
        })
      }).rejects.toThrow(UserNotFoundError)

      expect(mockRepository.findUserById).toHaveBeenCalledWith('1')
    })

    it('deve lançar UserNotPermissionError se usuário não estiver ativo', async () => {
      const inactiveUser = {
        ...validUser,
        status: 'INATIVO',
        refreshToken: hashedRefreshToken,
      }
      mockRepository.findUserById.mockResolvedValue(inactiveUser)

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: validRefreshToken,
        })
      }).rejects.toThrow(UserNotPermissionError)
    })

    it('deve lançar UserNotLoginError se usuário não tiver permissão de login', async () => {
      const userWithoutLogin = {
        ...validUser,
        login: 'NÃO',
        refreshToken: hashedRefreshToken,
      }
      mockRepository.findUserById.mockResolvedValue(userWithoutLogin)

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: validRefreshToken,
        })
      }).rejects.toThrow(UserNotLoginError)
    })

    it('deve lançar RefreshTokenInvalidError se não houver refresh token armazenado', async () => {
      const userWithoutRefreshToken = {
        ...validUser,
        refreshToken: undefined,
      }
      mockRepository.findUserById.mockResolvedValue(userWithoutRefreshToken)

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: validRefreshToken,
        })
      }).rejects.toThrow(RefreshTokenInvalidError)
    })

    it('deve lançar RefreshTokenInvalidError se o refresh token não corresponder', async () => {
      const differentHashedToken = await hash('different-token', 8)
      const userWithDifferentToken = {
        ...validUser,
        refreshToken: differentHashedToken,
      }
      mockRepository.findUserById.mockResolvedValue(userWithDifferentToken)

      await expect(async () => {
        await updateAccessTokenService.execute({
          refreshToken: validRefreshToken,
        })
      }).rejects.toThrow(RefreshTokenInvalidError)
    })
  })
})
