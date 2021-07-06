import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccountModel } from '../bank-account';
import { BeneficiaryModel } from '../beneficiary';
import { BusinessInterestModel } from '../business_interest';
import { ExecutorModel } from '../executor';
import { InsurancePolicyModel } from '../insurance_policy';
import { InvestmentModel } from '../investment';
import { PropertyModel } from '../property';
import { ValuablesModel } from '../valuables';

@Entity('user')
export class UserModel {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 255, nullable: false })
    email!: string;

    @Column({ length: 32, nullable: true })
    password!: string;

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

    @Column({ nullable: true })
    is_verify!: boolean;

    @Column({ length: 4, nullable: true })
    otp!: string;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updated_at!: Date;

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at!: Date;

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

}
