import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { VeiculoMovimentacao } from './VeiculoMovimentacao'

@Entity('TB_Veiculo')
export class Veiculo {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Placa', type: 'varchar', length: 10, nullable: true })
  placa?: string

  @Column({ name: 'Marca', type: 'varchar', length: 50, nullable: true })
  marca?: string

  @Column({ name: 'Modelo', type: 'varchar', length: 50, nullable: true })
  modelo?: string

  @Column({ name: 'Cor', type: 'varchar', length: 50, nullable: true })
  cor?: string

  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: true })
  status?: string

  @OneToMany(() => VeiculoMovimentacao, movimentacao => movimentacao.veiculo)
  movimentacoes!: VeiculoMovimentacao[]
}
