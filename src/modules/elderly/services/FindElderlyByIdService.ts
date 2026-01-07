import { inject, injectable } from 'tsyringe'
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'
import { IElderly } from '@modules/elderly/domain/models/IElderly'
import { ElderlyNotFoundError } from '@shared/errors/ElderlyNotFoundError'

@injectable()
export class FindElderlyByIdService {
  constructor(
    @inject('ElderlyRepository')
    private elderlyRepository: IElderlyRepository,
  ) {}

  async execute(id: string): Promise<IElderly> {
    const elderly = await this.elderlyRepository.findById(id)

    if (!elderly) {
      throw new ElderlyNotFoundError()
    }

    return elderly
  }
}
