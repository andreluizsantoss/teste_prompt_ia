import { inject, injectable } from 'tsyringe'
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'
import { IElderly } from '@modules/elderly/domain/models/IElderly'

@injectable()
export class FindAllElderlysWithActiveExitService {
  constructor(
    @inject('ElderlyRepository')
    private elderlyRepository: IElderlyRepository,
  ) {}

  async execute(): Promise<IElderly[]> {
    return await this.elderlyRepository.findAllWithActiveExit()
  }
}
