import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('poc-authenticate')
export class PosAuthenticateModel {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  id!: number;

  @Column('text', { nullable: false, name: 'client_id' })
  client_id?: string;

  @Column('text', { nullable: false, name: 'token' })
  token?: string;

  @Column('text', { nullable: false, name: 'secret_key' })
  secret_key?: string;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updated_at!: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at!: Date;
}
