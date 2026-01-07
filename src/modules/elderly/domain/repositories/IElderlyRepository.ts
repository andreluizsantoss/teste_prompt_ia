import { IElderly } from '@modules/elderly/domain/models/IElderly'

export interface IElderlyRepository {
  findAll(): Promise<IElderly[]>
  findById(id: string): Promise<IElderly | null>
  findAllWithActiveExit(): Promise<IElderly[]>
  findAllWithoutActiveExit(): Promise<IElderly[]>
}
