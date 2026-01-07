import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Autorizacao_Saida_Idoso')
export class AutorizacaoSaidaIdoso {
  @PrimaryColumn({ name: 'Numero', type: 'decimal', precision: 18, scale: 0 })
  numero!: number

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
    name: 'Codigo_Funcionario_Autorizacao',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioAutorizacao?: number

  @Column({
    name: 'Codigo_Funcionario_Acompanhante',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoFuncionarioAcompanhante?: number

  @Column({ name: 'Observacao', type: 'varchar', length: 'MAX', nullable: true })
  observacao?: string
}

