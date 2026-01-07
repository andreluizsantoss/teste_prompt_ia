import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Funcionario } from './Funcionario'

@Entity('TB_Funcionario_Ponto')
export class FuncionarioPonto {
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
    name: 'Entrada_Veiculo_Proprio',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  entradaVeiculoProprio?: string

  @Column({
    name: 'Entrada_Observacao',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  entradaObservacao?: string

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
    name: 'Saida_Veiculo_Proprio',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  saidaVeiculoProprio?: string

  @Column({
    name: 'Saida_Observacao',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  saidaObservacao?: string

  @ManyToOne(() => Funcionario, funcionario => funcionario.pontos)
  @JoinColumn({ name: 'Codigo_Funcionario' })
  funcionario?: Funcionario
}
