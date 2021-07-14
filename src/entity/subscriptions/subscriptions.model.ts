import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscriptions')
export class SubscriptionsModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column("uuid", { nullable: false })
    subscription_id?: string;

    @Column({ length: 45, nullable: true })
    coupons?: string;

    @Column({ nullable: true })
    next_invoice?: Date;

    @Column({ nullable: true })
    status?: string;

    @Column({ nullable: true })
    is_delete?: boolean;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

}
