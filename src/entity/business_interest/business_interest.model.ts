import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user';

@Entity('business_interest')
export class BusinessInterestModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ length: 255, nullable: false })
    company_name?: string;

    @Column({ length: 45, nullable: false })
    company_uen?: string;

    @Column({ length: 45, nullable: true })
    position?: string;

    @Column({ nullable: true, type: 'float' })
    estimated_current_market_value?: number;

    @Column({ nullable: true, type: 'float' })
    percentage_share?: number;

    @Column({ nullable: true , default :0 })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.business_interests, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}
