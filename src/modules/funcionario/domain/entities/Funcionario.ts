import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { FuncionarioPonto } from './FuncionarioPonto'
import { ServicoMovimentacao } from '../../../prestador-servico/domain/entities/ServicoMovimentacao'

@Entity('TB_Funcionario')
export class Funcionario {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Nome', type: 'varchar', length: 50, nullable: true })
  nome?: string

  @Column({ name: 'Endereco', type: 'varchar', length: 50, nullable: true })
  endereco?: string

  @Column({ name: 'Bairro', type: 'varchar', length: 50, nullable: true })
  bairro?: string

  @Column({ name: 'Cidade', type: 'varchar', length: 50, nullable: true })
  cidade?: string

  @Column({ name: 'CEP', type: 'varchar', length: 10, nullable: true })
  cep?: string

  @Column({ name: 'Estado', type: 'varchar', length: 2, nullable: true })
  estado?: string

  @Column({ name: 'CPF', type: 'varchar', length: 14, nullable: true })
  cpf?: string

  @Column({ name: 'Celular', type: 'varchar', length: 20, nullable: true })
  celular?: string

  @Column({ name: 'E_Mail', type: 'varchar', length: 50, nullable: true })
  email?: string

  @Column({ name: 'Cargo', type: 'varchar', length: 50, nullable: true })
  cargo?: string

  @Column({ name: 'Login', type: 'varchar', length: 3, nullable: true })
  login?: string

  @Column({ name: 'Senha', type: 'varchar', length: 20, nullable: true })
  senha?: string

  @Column({ name: 'ios_token', type: 'text', nullable: true })
  iosToken?: string

  @Column({ name: 'android_token', type: 'text', nullable: true })
  androidToken?: string

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken?: string

  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: true })
  status?: string

  @Column({ name: 'Foto', type: 'image', nullable: true })
  foto?: Buffer

  @OneToMany(() => FuncionarioPonto, (ponto) => ponto.funcionario)
  pontos!: FuncionarioPonto[]

  @OneToMany(
    () => ServicoMovimentacao,
    (movimentacao) => movimentacao.funcionarioResponsavel,
  )
  servicoMovimentacoes!: ServicoMovimentacao[]
}

