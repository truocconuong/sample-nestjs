import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_parameter')
export class SystemParameterModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 45, nullable: false })
    type?: string;

    @Column({ length: 45, nullable: false })
    value?: string;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
