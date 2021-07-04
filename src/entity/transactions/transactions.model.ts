import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class TransactionsModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("uuid", { nullable: false })
    user_id?: string;

    @Column({ nullable: false, type: 'float' })
    amount?: number;

    @Column({ length: 45, nullable: false })
    transactionscol?: string;

    @Column({ length: 255, nullable: false })
    request_url?: string;

    @Column({ nullable: false, type: 'json' })
    request_object?: string;

    @Column({ nullable: false, type: 'json' })
    response_object?: string;
    
    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;
}
