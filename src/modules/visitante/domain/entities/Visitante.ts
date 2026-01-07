import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Visitante')
export class Visitante {
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

  @Column({
    name: 'Codigo_Idoso',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: true,
  })
  codigoIdoso?: number

  @Column({
    name: 'Grau_Parentesco',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  grauParentesco?: string

  @Column({ name: 'CPF', type: 'varchar', length: 14, nullable: true })
  cpf?: string

  @Column({ name: 'Celular', type: 'varchar', length: 20, nullable: true })
  celular?: string

  @Column({ name: 'E_Mail', type: 'varchar', length: 50, nullable: true })
  email?: string

  @Column({ name: 'Status', type: 'varchar', length: 15, nullable: true })
  status?: string

  @Column({ name: 'Foto', type: 'image', nullable: true })
  foto?: Buffer
}

