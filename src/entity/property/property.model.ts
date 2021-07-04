import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('property')
export class PropertyModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ length: 255, nullable: false })
    country?: string;


    @Column({ nullable: true })
    is_solely?: boolean;

    @Column({ nullable: true })
    is_joint?: boolean;

    @Column({ length: 45, nullable: false })
    postal_code?: string;

    @Column({ length: 255, nullable: false })
    address_line_1?: string;

    @Column({ length: 255, nullable: false })
    address_line_2?: string;

    @Column({ length: 45, nullable: false })
    joint_name?: string;

    @Column({ length: 45, nullable: false })
    joint_contact?: string;

    @Column({ nullable: false })
    unit_number?: number;

    @Column({ nullable: true })
    tenure?: number;

    @Column({ length: 45, nullable: true })
    current_bank_loan_id?: string;

    @Column({ nullable: true })
    loan_start_date?: Date;

    @Column({ nullable: true })
    loan_end_date?: Date;

    @Column({ nullable: true })
    year_loan_taken?: number;

    @Column({ nullable: true, type: 'float' })
    interest_rate?: number;

    @Column({ nullable: true, type: 'float' })
    outstanding_loan_amount?: number;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
