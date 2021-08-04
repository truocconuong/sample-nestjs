import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../user';

@Entity('property')
export class PropertyModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id!: string;

    @Column({ length: 255, nullable: false })
    country!: string;


    @Column({ nullable: true })
    is_solely!: boolean;

    @Column({ nullable: true })
    is_joint!: boolean;

    @Column({ length: 45, nullable: true })
    postal_code!: string;

    @Column({ length: 255, nullable: true })
    address_line_1!: string;

    @Column({ length: 255, nullable: true })
    address_line_2!: string;

    @Column({ length: 45, nullable: true })
    joint_name!: string;

    @Column({ length: 45, nullable: true })
    joint_contact!: string;

    @Column({ nullable: true })
    unit_number!: string;

    @Column({ nullable: true })
    tenure!: number;

    @Column({ length: 45, nullable: true })
    current_bank_loan_id!: string;

    @Column({ nullable: true })
    loan_start_date!: Date;

    @Column({ nullable: true })
    loan_end_date!: Date;

    @Column({ nullable: true })
    year_loan_taken!: number;

    @Column({ nullable: true, type: 'float' })
    interest_rate!: number;

    @Column({ nullable: true, type: 'float' })
    outstanding_loan_amount!: number;

    @Column({ nullable: true})
    type_id!: string;

    @Column({ nullable: true})
    remaining_loan_tenure!: number;

    @Column({ nullable: true })
    is_delete!: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.properties, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;
}
