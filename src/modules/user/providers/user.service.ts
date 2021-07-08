import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountModel } from 'src/entity/bank-account';
import { BeneficiaryModel } from 'src/entity/beneficiary';
import { BusinessInterestModel } from 'src/entity/business_interest';
import { ExecutorModel } from 'src/entity/executor';
import { ExecutorDto } from '../dto/create-user.dto'
import { InsurancePolicyModel } from 'src/entity/insurance_policy';
import { InvestmentModel } from 'src/entity/investment';
import { PropertyModel } from 'src/entity/property';
import { UserModel } from 'src/entity/user';
import { ValuablesModel } from 'src/entity/valuables';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
import { UserRepositoryService } from './user-repository.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService,
        @InjectRepository(ExecutorModel)

        private repositoryExecutor: Repository<ExecutorModel>,
        @InjectRepository(BeneficiaryModel)
        private repositoryBeneficiary: Repository<BeneficiaryModel>,

        @InjectRepository(PropertyModel)
        private repositoryProperty: Repository<PropertyModel>,

        @InjectRepository(BankAccountModel)
        private repositoryBankAccount: Repository<BankAccountModel>,

        @InjectRepository(InsurancePolicyModel)
        private repositoryInsurancePolicy: Repository<InsurancePolicyModel>,

        @InjectRepository(InvestmentModel)
        private repositoryInvestment: Repository<InvestmentModel>,

        @InjectRepository(BusinessInterestModel)
        private repositoryBusinessInterest: Repository<BusinessInterestModel>,

        @InjectRepository(ValuablesModel)
        private repositoryValuables: Repository<ValuablesModel>,

    ) { }

    public async findAll(): Promise<UserModel[]> {
        return this.userRepositoryService.findAll();
    }

    public async create(data: Partial<UserModel>): Promise<UserModel> {
        return this.userRepositoryService.create(data);
    }


    public async update(id: string, data: Partial<UserModel>): Promise<UpdateResult> {
        return this.userRepositoryService.update(id, data);
    }

    public async findById(id: string): Promise<UserModel | undefined> {
        return this.userRepositoryService.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.userRepositoryService.remove(id);
    }

    public async findByEmail(email: string): Promise<UserModel | undefined> {
        const user = await this.userRepositoryService.findOne({ email })
        return user
    }

    public async createExecutor(data: Partial<ExecutorModel>) {
        const Executor = await this.repositoryExecutor.save(data)
        return Executor
    }

    public async createBeneficiary(data: Partial<BeneficiaryModel>) {
        const Beneficiary = await this.repositoryBeneficiary.save(data)
        return Beneficiary
    }

    public async createProperty(data: Partial<PropertyModel>) {
        const Property = await this.repositoryProperty.save(data)
        return Property
    }

    public async createBankAccount(data: Partial<BankAccountModel>) {
        const BankAccount = await this.repositoryBankAccount.save(data)
        return BankAccount
    }

    public async createInsurancePolicy(data: Partial<InsurancePolicyModel>) {
        const InsurancePolicy = await this.repositoryInsurancePolicy.save(data)
        return InsurancePolicy
    }

    public async createInvestment(data: Partial<InvestmentModel>) {
        const Investment = await this.repositoryInvestment.save(data)
        return Investment
    }

    public async createBusinessInterest(data: Partial<BusinessInterestModel>) {
        const BusinessInterest = await this.repositoryBusinessInterest.save(data)
        return BusinessInterest
    }

    public async createValuables(data: Partial<ValuablesModel>) {
        const Valuables = await this.repositoryValuables.save(data)
        return Valuables
    }

    public async getProfileUser (id : string) {
        const user = await this.userRepositoryService.findById(id,{
            relations : ['executors','beneficiaries','properties','bank_accounts','insurance_policies','investments','business_interests','valuables','executors.master_data','beneficiaries.master_data','valuables.master_data']
        });
        return user
    }

    public async findExecutor(id: string){
        const executor = await this.repositoryExecutor.findOne(id)
        return executor
    }

    public async updateExecutor(id: string, body: ExecutorDto){
        const executor = await this.repositoryExecutor.update(id, body)
        return executor
    }

    public async findProperty(id: string){
        const property = await this.repositoryProperty.findOne(id)
        return property
    }

    public async updateProperty(id: string, body: Partial<PropertyModel>){
        const property = await this.repositoryProperty.update(id, body)
        return property
    }

    public async findBeneficiary(id: string){
        const beneficiary = await this.repositoryBeneficiary.findOne(id)
        return beneficiary
    }

    public async updateBeneficiary(id: string, body: Partial<BeneficiaryModel>){
        const beneficiary = await this.repositoryBeneficiary.update(id, body)
        return beneficiary
    }

    public async findBusinessInterests(id: string){
        const beneficiary = await this.repositoryBusinessInterest.findOne(id)
        return beneficiary
    }

    public async updateBusinessInterests(id: string, body: Partial<BeneficiaryModel>){
        const beneficiary = await this.repositoryBusinessInterest.update(id, body)
        return beneficiary
    }

    public async findInvestment(id: string){
        const investment = await this.repositoryInvestment.findOne(id)
        return investment
    }

    public async updateInvestment(id: string, body: Partial<InvestmentModel>){
        const investment = await this.repositoryInvestment.update(id, body)
        return investment
    }

    public async findValuables(id: string){
        const valuables = await this.repositoryValuables.findOne(id)
        return valuables
    }

    public async updateValuables(id: string, body: Partial<ValuablesModel>){
        const valuables = await this.repositoryValuables.update(id, body)
        return valuables
    }

    public async findBankAccount(id: string){
        const bankAccount = await this.repositoryBankAccount.findOne(id)
        return bankAccount
    }

    public async updateBankAccount(id: string, body: Partial<BankAccountModel>){
        const bankAccount = await this.repositoryBankAccount.update(id, body)
        return bankAccount
    }

    public async findInsurancePolicy(id: string){
        const insurancePolicy = await this.repositoryInsurancePolicy.findOne(id)
        return insurancePolicy
    }

    public async updateInsurancePolicy(id: string, body: Partial<InsurancePolicyModel>){
        const insurancePolicy = await this.repositoryInsurancePolicy.update(id, body)
        return insurancePolicy
    }
}
