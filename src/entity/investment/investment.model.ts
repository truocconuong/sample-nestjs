import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user';

@Entity('investment')
export class InvestmentModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column("uuid", { nullable: false })
    type_id?: string;

    @Column({ length: 45, nullable: false })
    financial_institutions?: string;

    @Column({ length: 45, nullable: true })
    account_no?: string;

    @Column({ nullable: true, type: 'float' })
    capital_outlay?: number;

    @Column({ nullable: true, type: 'float' })
    current_market_value?: number;

    @Column({ nullable: true , default :0 })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.investments, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}
