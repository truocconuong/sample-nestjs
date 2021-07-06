import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user';

@Entity('bank_account')
export class BankAccountModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ length: 45, nullable: false, type: 'uuid' })
    bank_id?: string;

    @Column({ length: 45, nullable: true })
    account_no?: string;

    @Column({ nullable: true })
    is_solely?: boolean;

    @Column({ nullable: true })
    is_joint?: boolean;

    @Column({ nullable: true, type: "float" })
    current_balance?: number;

    @Column({ length: 255, nullable: true })
    account_holder?: string;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.bank_accounts, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}
