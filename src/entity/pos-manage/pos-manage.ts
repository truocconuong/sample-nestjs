import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('poc-manage')
export class PocManageModel {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'id' })
  id!: number;

  @Column('varchar', { nullable: false, name: 'order_id' })
  order_id!: string;

  @Column('varchar', { nullable: false, name: 'pos_id' })
  pos_id?: string;

  @Column('varchar', { nullable: false, name: 'username' })
  username?: string;

  @Column('varchar', { nullable: false, name: 'password' })
  password?: string;

  @Column('text', { nullable: false, name: 'client_id' })
  client_id?: string;

  @Column('text', { nullable: false, name: 'client_secret' })
  client_secret?: string;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updated_at!: Date;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at!: Date;
}
