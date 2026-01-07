import { IUser } from '../models/IUser'
import { IUserResponse } from '../models/IUserResponse'

export interface IAuthenticationRepository {
  findUserByCPF(cpf: string): Promise<IUserResponse | null>
  findUserById(id: string): Promise<IUserResponse | null>
  saveSession(user: IUser): Promise<void>
  updateRefreshToken(user: IUser): Promise<void>
  updateDeviceToken(user: IUser): Promise<IUserResponse | null>
}
