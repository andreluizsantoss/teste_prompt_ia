import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Veiculo } from './Veiculo'

@Entity('TB_Veiculo_Movimentacao')
export class VeiculoMovimentacao {
  @PrimaryColumn({
    name: 'Codigo_Viagem',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoViagem!: number

  @Column({
    name: 'Codigo_Veiculo',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoVeiculo?: number

  @Column({ name: 'Data_Saida', type: 'datetime', nullable: true })
  dataSaida?: Date

  @Column({
    name: 'KM_Saida',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  kmSaida?: number

  @Column({
    name: 'Codigo_Funcionario_Portaria_Saida',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioPortariaSaida?: number

  @Column({
    name: 'Observacao_Saida',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  observacaoSaida?: string

  @Column({ name: 'Data_Entrada', type: 'datetime', nullable: true })
  dataEntrada?: Date

  @Column({
    name: 'KM_Entrada',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  kmEntrada?: number

  @Column({
    name: 'Codigo_Funcionario_Portaria_Entrada',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioPortariaEntrada?: number

  @Column({
    name: 'Intercorrencia_Veiculo',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  intercorrenciaVeiculo?: string

  @Column({
    name: 'Intercorrencia_Observacao',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  intercorrenciaObservacao?: string

  @ManyToOne(() => Veiculo, veiculo => veiculo.movimentacoes)
  @JoinColumn({ name: 'Codigo_Veiculo' })
  veiculo?: Veiculo
}
