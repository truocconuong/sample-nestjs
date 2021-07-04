import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('beneficiary')
export class BeneficiaryModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 255, nullable: false })
    full_legal_name?: string;

    @Column("uuid", { nullable: false })
    relationship_id?: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ length: 45, nullable: true })
    email?: string;

    @Column({ length: 45, nullable: true })
    nric?: string;

    @Column({ nullable: true, type: 'float' })
    percent?: number;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
