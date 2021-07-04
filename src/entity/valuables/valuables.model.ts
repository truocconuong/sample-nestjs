import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('valuables')
export class ValuablesModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column("uuid", { nullable: false })
    type_id?: string;

    @Column({ length: 255, nullable: false })
    brand?: string;

    @Column({ length: 255, nullable: false })
    model?: string;

    @Column({ length: 255, nullable: false })
    serial_no?: string;

    @Column({ length: 45, nullable: false })
    plate_no?: string;

    @Column({ length: 255, nullable: false })
    country_name?: string;

    @Column({ length: 255, nullable: false })
    address_line_1?: string;

    @Column({ length: 255, nullable: false })
    address_line_2?: string;

    @Column({ length: 45, nullable: false })
    postal_code?: string;

    @Column({ length: 45, nullable: false })
    pet_name?: string;

    @Column({ length: 45, nullable: false })
    pet_breed?: string;

    @Column({ length: 45, nullable: false })
    pet_registration_number?: string;

    @Column({ nullable: false, type: 'text' })
    safe_box_detail?: string;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
