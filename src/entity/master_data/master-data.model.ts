import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BeneficiaryModel } from '../beneficiary';
import { ExecutorModel } from '../executor';
import { ValuablesModel } from '../valuables';

@Entity('master_data')
export class MasterDataModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 45, nullable: false })
    name?: string;

    @Column({ length: 45, nullable: false })
    value?: string;

    @Column({ nullable: false })
    is_enable?: boolean;


    @Column({ nullable: false })
    order?: number;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @OneToOne(() => ExecutorModel, executor => executor.master_data)
    executors!: ExecutorModel;

    @Exclude()
    @DeleteDateColumn({ name: 'deleted_timestamp' })
    deletedTimestamp!: Date;


    @OneToOne(() => BeneficiaryModel, beneficiary => beneficiary.master_data)
    beneficiaries!: BeneficiaryModel;

    @OneToOne(() => ValuablesModel, valuable => valuable.master_data)
    valuables!: ValuablesModel;
}
