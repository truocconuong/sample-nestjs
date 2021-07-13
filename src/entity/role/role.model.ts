import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserModel } from '../user';

@Entity('roles')
export class RoleModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 255, nullable: false })
    title!: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @OneToMany(() => UserModel, user => user.role_id, { persistence: true })
    users!: UserModel[];

}
