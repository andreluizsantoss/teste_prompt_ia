import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Funcionario_Movimentacao')
export class FuncionarioMovimentacao {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({
    name: 'Codigo_Funcionario',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionario?: number

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

  @Column({
    name: 'Codigo_Viagem_Saida',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoViagemSaida?: number

  @Column({ name: 'Tipo', type: 'varchar', length: 30, nullable: true })
  tipo?: string

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
    name: 'Codigo_Viagem_Entrada',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoViagemEntrada?: number
}
