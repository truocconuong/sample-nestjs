import { Column, Entity, OneToMany, PrimaryGeneratedColumn, JoinColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { BankAccountModel } from '../bank-account';
import { BeneficiaryModel } from '../beneficiary';
import { BusinessInterestModel } from '../business_interest';
import { ExecutorModel } from '../executor';
import { InsurancePolicyModel } from '../insurance_policy';
import { InvestmentModel } from '../investment';
import { PropertyModel } from '../property';
import { RoleModel } from '../role';
import { ValuablesModel } from '../valuables';
import { SubscriptionsModel } from '../subscriptions';
import { OrdersModel } from '../orders';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 255, nullable: false })
    email!: string;

    @Column({ length: 255, nullable: true })
    email_personal!: string;

    @Column({ length: 255, nullable: true })
    will_registry!: string;

    @Column({ length: 255, nullable: true })
    social!: string;

    @Column({ length: 255, nullable: true })
    social_id!: string;

    @Column({ length: 255, nullable: true, select: false })
    password!: string;

    @Column("uuid", { nullable: false })
    role_id!: string;

    @Column({ length: 255, nullable: true })
    nric!: string;

    @Column({ length: 6, nullable: true })
    postal_code!: string;

    @Column({ length: 255, nullable: true })
    address_line_1!: string;

    @Column({ length: 255, nullable: true })
    address_line_2!: string;

    @Column({ length: 20, nullable: true })
    unit_number!: string;

    @Column({ length: 255, nullable: true })
    full_legal_name!: string;

    @Column({ length: 255, nullable: true })
    will_pdf_link!: string;

    @Column({ length: 45, nullable: true })
    phone!: string;

    @Column({ nullable: true })
    is_verify!: boolean;

    @Column({ length: 4, nullable: true})
    otp!: string;

    @Column({ length: 45, nullable: true })
    customer_stripe_id!: string;

    @Column({ length: 255, nullable: true })
    pdf_upload_url!: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'time_upload_pdf' })
    time_upload_pdf!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

    @Exclude()
    @DeleteDateColumn({ name: 'deleted_timestamp' })
    deletedTimestamp!: Date;

    @OneToMany(() => ExecutorModel, executor => executor.user, { persistence: true })
    executors!: ExecutorModel[];


    @OneToMany(() => BeneficiaryModel, beneficiary => beneficiary.user, { persistence: true })
    beneficiaries!: BeneficiaryModel[];

    @OneToMany(() => PropertyModel, property => property.user, { persistence: true })
    properties!: PropertyModel[];

    @OneToMany(() => BankAccountModel, bank_account => bank_account.user, { persistence: true })
    bank_accounts!: BankAccountModel[];

    @OneToMany(() => InsurancePolicyModel, insurance_policy => insurance_policy.user, { persistence: true })
    insurance_policies!: InsurancePolicyModel[];

    @OneToMany(() => InvestmentModel, investment => investment.user, { persistence: true })
    investments!: InvestmentModel[];

    @OneToMany(() => BusinessInterestModel, business_interest => business_interest.user, { persistence: true })
    business_interests!: BusinessInterestModel[];

    @OneToMany(() => ValuablesModel, valuable => valuable.user, { persistence: true })
    valuables!: ValuablesModel[];

    @ManyToOne(() => RoleModel, roles => roles.users, { persistence: true })
    @JoinColumn({ name: 'role_id' })
    role!: RoleModel;

    @OneToMany(() => SubscriptionsModel, subscription => subscription.user, { persistence: true })
    subscriptions!: SubscriptionsModel[];

    @OneToMany(() => OrdersModel, order => order.user, { persistence: true })
    orders!: OrdersModel[];
}
