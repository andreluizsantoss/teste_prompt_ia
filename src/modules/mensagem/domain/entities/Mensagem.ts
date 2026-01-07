import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { MensagemFuncionario } from './MensagemFuncionario'

@Entity('TB_Mensagem')
export class Mensagem {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Mensagem', type: 'varchar', length: 'MAX', nullable: true })
  mensagem?: string

  @Column({ name: 'Data_Inicial', type: 'date', nullable: true })
  dataInicial?: Date

  @Column({ name: 'Data_Final', type: 'date', nullable: true })
  dataFinal?: Date

  @OneToMany(
    () => MensagemFuncionario,
    funcionario => funcionario.mensagemRelacao,
  )
  funcionarios!: MensagemFuncionario[]
}
