import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Intercorrencia')
export class Intercorrencia {
  @PrimaryColumn({
    name: 'Sequencia',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  sequencia!: number

  @Column({ name: 'Data_Intercorrencia', type: 'date', nullable: true })
  dataIntercorrencia?: Date

  @Column({
    name: 'Descricao_Intercorrencia',
    type: 'varchar',
    length: 'MAX',
    nullable: true,
  })
  descricaoIntercorrencia?: string

  @Column({ name: 'Conduta', type: 'varchar', length: 'MAX', nullable: true })
  conduta?: string

  @Column({ name: 'Data_Atualizacao', type: 'date', nullable: true })
  dataAtualizacao?: Date

  @Column({
    name: 'Codigo_Funcionario_Registro',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoFuncionarioRegistro!: number
}
