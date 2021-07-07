import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MasterDataModel } from '../master_data';
import { UserModel } from '../user';

@Entity('executor')
export class ExecutorModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id!: string;

    @Column({ length: 255, nullable: false })
    full_legal_name!: string;

    @Column("uuid", { nullable: false })
    relationship_id!: string;

    @Column({ length: 45, nullable: true })
    email!: string;

    @Column({ length: 45, nullable: true })
    nric!: string;

    @Column({ nullable: true })
    is_delete!: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.executors, { persistence: false })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;

    @ManyToOne(() => MasterDataModel, masterData => masterData.executors)
    @JoinColumn({ name: 'relationship_id' })
    master_data!: MasterDataModel;
}
