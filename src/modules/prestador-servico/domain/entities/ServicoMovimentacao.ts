import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { PrestadorServico } from './PrestadorServico'
import { Funcionario } from '../../../funcionario/domain/entities/Funcionario'

@Entity('TB_Servico_Movimentacao')
export class ServicoMovimentacao {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

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

  @Column({ name: 'Objetivo', type: 'varchar', length: 200, nullable: true })
  objetivo?: string

  @Column({
    name: 'Codigo_Funcionario_Responsavel',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioResponsavel?: number

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
    name: 'Codigo_Prestador_Servico',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoPrestadorServico?: number

  @ManyToOne(
    () => PrestadorServico,
    (prestador) => prestador.servicoMovimentacoes,
  )
  @JoinColumn({ name: 'Codigo_Prestador_Servico' })
  prestadorServico?: PrestadorServico

  @ManyToOne(
    () => Funcionario,
    (funcionario) => funcionario.servicoMovimentacoes,
  )
  @JoinColumn({ name: 'Codigo_Funcionario_Responsavel' })
  funcionarioResponsavel?: Funcionario
}

