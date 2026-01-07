import { injectable } from 'tsyringe'
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'
import { IAuthenticationRepository } from '@modules/authentication/domain/repositories/IAuthenticationRepository'
import { IUser } from '@modules/authentication/domain/models/IUser'
import { IUserResponse } from '@modules/authentication/domain/models/IUserResponse'

@injectable()
export class AuthenticationRepository implements IAuthenticationRepository {
  private repository = AppDataSource.getRepository(Funcionario)

  async findUserByCPF(cpf: string): Promise<IUserResponse | null> {
    try {
      const funcionario = await this.repository.findOne({
        where: { cpf },
        select: [
          'codigo',
          'nome',
          'cpf',
          'email',
          'cargo',
          'login',
          'senha',
          'iosToken',
          'androidToken',
          'refreshToken',
          'status',
          'foto',
        ],
      })

      if (!funcionario) {
        return null
      }

      return this.mapToUserResponse(funcionario)
    } catch (error) {
      console.error('Erro ao buscar usuário por CPF:', error)
      throw error
    }
  }

  async findUserById(id: string): Promise<IUserResponse | null> {
    try {
      const funcionario = await this.repository.findOne({
        where: { codigo: Number(id) },
        select: [
          'codigo',
          'nome',
          'cpf',
          'email',
          'cargo',
          'login',
          'senha',
          'iosToken',
          'androidToken',
          'refreshToken',
          'status',
          'foto',
        ],
      })

      if (!funcionario) {
        return null
      }

      return this.mapToUserResponse(funcionario)
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      throw error
    }
  }

  async saveSession(user: IUser): Promise<void> {
    try {
      const updateData: Partial<Funcionario> = {}

      if (user.refreshToken !== undefined) {
        updateData.refreshToken = user.refreshToken
      }
      if (user.iosToken !== undefined) {
        updateData.iosToken = user.iosToken
      }
      if (user.androidToken !== undefined) {
        updateData.androidToken = user.androidToken
      }

      await this.repository.update({ codigo: user.codigo }, updateData)
    } catch (error) {
      console.error('Erro ao salvar sessão:', error)
      throw error
    }
  }

  async updateRefreshToken(user: IUser): Promise<void> {
    try {
      await this.repository.update(
        { codigo: user.codigo },
        {
          refreshToken: user.refreshToken,
        },
      )
    } catch (error) {
      console.error('Erro ao atualizar refresh token:', error)
      throw error
    }
  }

  async updateDeviceToken(user: IUser): Promise<IUserResponse | null> {
    try {
      const updateData: Partial<Funcionario> = {}

      if (user.iosToken !== undefined) {
        updateData.iosToken = user.iosToken
      }
      if (user.androidToken !== undefined) {
        updateData.androidToken = user.androidToken
      }

      await this.repository.update({ codigo: user.codigo }, updateData)

      return this.findUserById(user.codigo.toString())
    } catch (error) {
      console.error('Erro ao atualizar device token:', error)
      throw error
    }
  }

  private mapToUserResponse(funcionario: Funcionario): IUserResponse {
    return {
      codigo: funcionario.codigo,
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      cargo: funcionario.cargo,
      login: funcionario.login,
      senha: funcionario.senha,
      iosToken: funcionario.iosToken,
      androidToken: funcionario.androidToken,
      refreshToken: funcionario.refreshToken,
      status: funcionario.status,
      foto: funcionario.foto,
    }
  }
}
