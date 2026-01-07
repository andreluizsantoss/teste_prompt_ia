import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Mensagem } from './Mensagem'

@Entity('TB_Mensagem_Funcionario')
export class MensagemFuncionario {
  @PrimaryColumn({
    name: 'Codigo_Mensagem',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoMensagem!: number

  @PrimaryColumn({
    name: 'Codigo_Funcionario',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoFuncionario!: number

  @Column({ name: 'Visualizado', type: 'varchar', length: 3, nullable: true })
  visualizado?: string

  @ManyToOne(() => Mensagem, mensagem => mensagem.funcionarios)
  @JoinColumn({ name: 'Codigo_Mensagem' })
  mensagemRelacao?: Mensagem
}
