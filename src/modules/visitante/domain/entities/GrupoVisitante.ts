import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { VisitanteMovimentacao } from './VisitanteMovimentacao'

@Entity('TB_Grupo_Visitante')
export class GrupoVisitante {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Descricao', type: 'varchar', length: 50, nullable: true })
  descricao?: string

  @OneToMany(() => VisitanteMovimentacao, movimentacao => movimentacao.grupo)
  movimentacoes!: VisitanteMovimentacao[]
}
