import { injectable } from 'tsyringe'
import { AppDataSource } from '@shared/infra/database/data-source'
import { Idoso } from '@modules/idoso/domain/entities/Idoso'
import { IElderlyRepository } from '@modules/elderly/domain/repositories/IElderlyRepository'
import { IElderly } from '@modules/elderly/domain/models/IElderly'

@injectable()
export class ElderlyRepository implements IElderlyRepository {
  private repository = AppDataSource.getRepository(Idoso)

  async findAll(): Promise<IElderly[]> {
    try {
      const elderlys = await this.repository.find({
        where: { status: 'ATIVO' },
        order: { nome: 'ASC' },
      })

      return elderlys.map(this.mapToElderly)
    } catch (error) {
      console.error('Erro ao buscar idosos:', error)
      throw error
    }
  }

  async findById(id: string): Promise<IElderly | null> {
    try {
      const elderly = await this.repository.findOne({
        where: { codigo: Number(id), status: 'ATIVO' },
      })

      if (!elderly) {
        return null
      }

      return this.mapToElderly(elderly)
    } catch (error) {
      console.error('Erro ao buscar idoso por ID:', error)
      throw error
    }
  }

  async findAllWithActiveExit(): Promise<IElderly[]> {
    try {
      // Buscar idosos que saíram hoje e ainda não voltaram
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const elderlys = await this.repository
        .createQueryBuilder('idoso')
        .innerJoinAndSelect('idoso.movimentacoes', 'mov')
        .where('idoso.status = :status', { status: 'ATIVO' })
        .andWhere('mov.dataSaida >= :today', { today })
        .andWhere('mov.dataEntrada IS NULL')
        .orderBy('idoso.nome', 'ASC')
        .getMany()

      return elderlys.map(this.mapToElderly)
    } catch (error) {
      console.error('Erro ao buscar idosos com saída ativa:', error)
      throw error
    }
  }

  async findAllWithoutActiveExit(): Promise<IElderly[]> {
    try {
      // Buscar idosos que não têm saída ativa hoje
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const elderlysWithExit = await this.repository
        .createQueryBuilder('idoso')
        .innerJoin('idoso.movimentacoes', 'mov')
        .where('idoso.status = :status', { status: 'ATIVO' })
        .andWhere('mov.dataSaida >= :today', { today })
        .andWhere('mov.dataEntrada IS NULL')
        .select('idoso.codigo')
        .getRawMany()

      const excludeIds = elderlysWithExit.map(e => e.idoso_codigo)

      const query = this.repository
        .createQueryBuilder('idoso')
        .where('idoso.status = :status', { status: 'ATIVO' })

      if (excludeIds.length > 0) {
        query.andWhere('idoso.codigo NOT IN (:...ids)', { ids: excludeIds })
      }

      const elderlys = await query.orderBy('idoso.nome', 'ASC').getMany()

      return elderlys.map(this.mapToElderly)
    } catch (error) {
      console.error('Erro ao buscar idosos sem saída ativa:', error)
      throw error
    }
  }

  private mapToElderly(idoso: Idoso): IElderly {
    return {
      codigo: idoso.codigo,
      nome: idoso.nome,
      apelido: idoso.apelido,
      foto: idoso.foto,
      status: idoso.status,
    }
  }
}
