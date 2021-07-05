import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExecutorModel } from '../executor';

@Entity('user')
export class UserModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 255, nullable: false })
    email?: string;

    @Column({ length: 32, nullable: true })
    password?: string;

    @Column({ length: 255, nullable: true })
    nric?: string;

    @Column({ length: 6, nullable: true })
    postal_code?: string;

    @Column({ length: 255, nullable: true })
    address_line_1?: string;

    @Column({ length: 255, nullable: true })
    address_line_2?: string;

    @Column({ length: 20, nullable: true })
    unit_number?: string;

    @Column({ length: 255, nullable: true })
    full_legal_name?: string;

    @Column({ length: 255, nullable: true })
    will_pdf_link?: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @OneToMany(() => ExecutorModel, executor => executor.user_id, { persistence: true })
    executors!: ExecutorModel[];


}
