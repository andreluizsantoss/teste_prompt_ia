import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Configuracao')
export class Configuracao {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Nome', type: 'varchar', length: 50, nullable: true })
  nome?: string

  @Column({ name: 'CNPJ', type: 'varchar', length: 20, nullable: true })
  cnpj?: string

  @Column({ name: 'Endereco', type: 'varchar', length: 100, nullable: true })
  endereco?: string

  @Column({ name: 'Bairro', type: 'varchar', length: 50, nullable: true })
  bairro?: string

  @Column({ name: 'CEP', type: 'varchar', length: 10, nullable: true })
  cep?: string

  @Column({ name: 'Cidade', type: 'varchar', length: 50, nullable: true })
  cidade?: string

  @Column({ name: 'Estado', type: 'varchar', length: 2, nullable: true })
  estado?: string

  @Column({ name: 'Telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string

  @Column({ name: 'E_Mail', type: 'varchar', length: 50, nullable: true })
  email?: string

  @Column({
    name: 'Sistema_Atendimento',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  sistemaAtendimento?: string

  @Column({ name: 'Logo_Empresa', type: 'image', nullable: true })
  logoEmpresa?: Buffer
}
