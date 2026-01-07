import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Idoso } from './Idoso'

@Entity('TB_Idoso_Movimentacao')
export class IdosoMovimentacao {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({
    name: 'Codigo_Idoso',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoIdoso?: number

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

  @Column({
    name: 'Numero_Autorizacao',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  numeroAutorizacao?: number

  @ManyToOne(() => Idoso, (idoso) => idoso.movimentacoes)
  @JoinColumn({ name: 'Codigo_Idoso' })
  idoso?: Idoso
}

