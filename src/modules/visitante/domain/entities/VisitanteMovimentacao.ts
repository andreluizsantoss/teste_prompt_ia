import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { GrupoVisitante } from './GrupoVisitante'

@Entity('TB_Visitante_Movimentacao')
export class VisitanteMovimentacao {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({
    name: 'Codigo_Visitante',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoVisitante?: number

  @Column({
    name: 'Codigo_Grupo',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoGrupo?: number

  @Column({
    name: 'Numero_Pessoas_grupo',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  numeroPessoasGrupo?: number

  @Column({
    name: 'Codigo_Idoso',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoIdoso?: number

  @Column({ name: 'Data_Entrada', type: 'datetime', nullable: true })
  dataEntrada?: Date

  @Column({
    name: 'Codigo_Funcionario_Portaria_Entrada',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioPortariaEntrada?: number

  @Column({
    name: 'Motivo_Visita',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  motivoVisita?: string

  @Column({ name: 'Data_Saida', type: 'datetime', nullable: true })
  dataSaida?: Date

  @Column({
    name: 'Codigo_Funcionario_Portaria_Saida',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioPortariaSaida?: number

  @ManyToOne(() => GrupoVisitante, grupo => grupo.movimentacoes)
  @JoinColumn({ name: 'Codigo_Grupo' })
  grupo?: GrupoVisitante
}
