import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('TB_Disparo_Email')
export class DisparoEmail {
  @PrimaryColumn({
    name: 'Codigo_Rotina',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoRotina!: number

  @PrimaryColumn({
    name: 'Codigo_Situacao',
    type: 'decimal',
    precision: 18,
    scale: 0,
  })
  codigoSituacao!: number

  @Column({
    name: 'Identificacao',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  identificacao?: string

  @Column({ name: 'E_Mail1', type: 'varchar', length: 100, nullable: true })
  email1?: string

  @Column({ name: 'E_Mail2', type: 'varchar', length: 100, nullable: true })
  email2?: string

  @Column({ name: 'E_Mail3', type: 'varchar', length: 100, nullable: true })
  email3?: string
}
