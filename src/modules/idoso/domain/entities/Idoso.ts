import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { IdosoMovimentacao } from './IdosoMovimentacao'

@Entity('TB_Idoso')
export class Idoso {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Nome', type: 'varchar', length: 80, nullable: true })
  nome?: string

  @Column({ name: 'Apelido', type: 'varchar', length: 40, nullable: true })
  apelido?: string

  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: true })
  status?: string

  @Column({ name: 'Foto', type: 'image', nullable: true })
  foto?: Buffer

  @OneToMany(() => IdosoMovimentacao, movimentacao => movimentacao.idoso)
  movimentacoes!: IdosoMovimentacao[]
}
