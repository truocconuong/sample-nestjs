import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MasterDataModel } from '../master_data';
import { UserModel } from '../user';

@Entity('valuables')
export class ValuablesModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column("uuid", { nullable: true })
    type_id?: string;

    @Column({ length: 255, nullable: true })
    brand?: string;

    @Column({ length: 255, nullable: true })
    model?: string;

    @Column({ length: 255, nullable: true })
    serial_no?: string;

    @Column({ length: 45, nullable: true })
    plate_no?: string;

    @Column({ length: 255, nullable: true })
    country_name?: string;

    @Column({ length: 255, nullable: true })
    address_line_1?: string;

    @Column({ length: 255, nullable: true })
    address_line_2?: string;

    @Column({ length: 45, nullable: true })
    postal_code?: string;

    @Column({ length: 45, nullable: true })
    pet_name?: string;

    @Column({ length: 45, nullable: true })
    pet_breed?: string;

    @Column({ length: 45, nullable: true })
    pet_registration_number?: string;

    @Column({ nullable: true, type: 'text' })
    safe_box_detail?: string;

    @Column({ nullable: true , default :0 })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @ManyToOne(() => UserModel, user => user.valuables, { persistence: true })
    @JoinColumn({ name: 'user_id' })
    user!: UserModel;

    @ManyToOne(() => MasterDataModel, masterData => masterData.valuables)
    @JoinColumn({ name: 'type_id' })
    master_data!: MasterDataModel;
}
