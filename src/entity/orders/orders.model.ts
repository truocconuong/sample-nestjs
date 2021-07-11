import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('orders')
export class OrdersModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ length: 45, nullable: false })
    order_id?: string;

    @Column({ nullable: false })
    paid?: boolean;

    @Column({ nullable: false })
    paid_date?: Date;

    @Column({ nullable: false, length: '45' })
    status?: string;

    @Column({ nullable: false, type: 'float' })
    amount?: number;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
