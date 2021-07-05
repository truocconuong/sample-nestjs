import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact')
export class ContactModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 45, nullable: false })
    first_name?: string;

    @Column({ length: 45, nullable: false })
    last_name?: string;

    @Column({ length: 45, nullable: false })
    email?: string;

    @Column({ length: 255, nullable: false })
    reason?: string;

    @Column({ length: 255, nullable: false })
    message?: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
