import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promocodes')
export class PromocodesModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 45, nullable: false })
    name?: string;

    @Column({ nullable: false })
    percent?: number;

    @Column({ nullable: true })
    type?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
