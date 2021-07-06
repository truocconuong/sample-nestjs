import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user';

@Entity('insurance_policy')
export class InsurancePolicyModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column("uuid", { nullable: true })
    beneficiary_id?: string;

    @Column({ length: 255, nullable: true })
    insurance_company?: string;

    @Column({ nullable: true })
    is_non_nomivated?: boolean;

    @Column({ nullable: true })
    is_nominated?: boolean;

    @Column({ length: 255, nullable: true })
    policy_name?: string;

    @Column({ length: 45, nullable: true })
    policy_no?: string;

    @Column({ nullable: true, type: 'float' })
    current_value?: number;

    @Column({ nullable: true, type: 'float' })
    converage?: number;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.insurance_policies, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}

