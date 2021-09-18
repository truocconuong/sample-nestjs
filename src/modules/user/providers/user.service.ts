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
import { BlackListModel } from 'src/entity/black_list';
import { ValuablesModel } from 'src/entity/valuables';
import { RoleModel } from 'src/entity/role'
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
import { UserRepositoryService } from './user-repository.service';

import {
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,

    @InjectRepository(ExecutorModel)
    private repositoryExecutor: Repository<ExecutorModel>,

    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,


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

    @InjectRepository(BlackListModel)
    private repositoryBlackList: Repository<BlackListModel>,

    @InjectRepository(RoleModel)
    private repositoryRole: Repository<RoleModel>,

  ) { }

  public async findAll(): Promise<UserModel[]> {
    return this.userRepositoryService.findAll();
  }

  public async create(data: Partial<UserModel>): Promise<UserModel> {
    return this.userRepositoryService.create(data);
  }

  public async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email
      }
    })
  }


  public async update(id: string, data: Partial<UserModel>): Promise<UpdateResult> {
    // const user = await this.userRepositoryService.findById(id);

    // if (email && user?.email !== email) {
    //   if (!user?.is_verify) {
    //     throw new HttpException('Email is not verify', HttpStatus.BAD_REQUEST)

    //   }
    //   const checkUserExists = await this.userRepository
    //     .createQueryBuilder('user')
    //     .where('user.id !=:userId', { userId: id })
    //     .andWhere('user.email = :email', { email })
    //     .getOne();
    //   if (checkUserExists) {
    //     throw new HttpException('conflict email', HttpStatus.CONFLICT)
    //   }
    // }

    return this.userRepositoryService.update(id, data);
  }

  public async findById(id: string): Promise<UserModel | undefined> {
    return this.userRepositoryService.findById(id)
  }

  public async remove(id: string): Promise<DeleteResult> {
    return this.userRepositoryService.remove(id);
  }

  public async findOne(query: any, options?: {}): Promise<UserModel | undefined> {
    const user = await this.userRepositoryService.findOne(query, options)
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

  public async getProfileUser(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.executors', 'executors', 'executors.is_delete != true')
      .leftJoinAndSelect('user.beneficiaries', 'beneficiaries', 'beneficiaries.is_delete != true')
      .leftJoinAndSelect('user.properties', 'properties', 'properties.is_delete != true')
      .leftJoinAndSelect('user.bank_accounts', 'bank_accounts', 'bank_accounts.is_delete != true')
      .leftJoinAndSelect('user.insurance_policies', 'insurance_policies', 'insurance_policies.is_delete != true')
      .leftJoinAndSelect('user.investments', 'investments', 'investments.is_delete != true')
      .leftJoinAndSelect('user.business_interests', 'business_interests', 'business_interests.is_delete != true')
      .leftJoinAndSelect('user.valuables', 'valuables', 'valuables.is_delete != true')
      .getOne()
    return user
  }

  public async findExecutor(id: string) {
    const executor = await this.repositoryExecutor.findOne(id)
    return executor
  }

  public async updateExecutor(id: string, body: ExecutorDto) {
    const executor = await this.repositoryExecutor.update(id, body)
    return executor
  }

  public async findProperty(id: string) {
    const property = await this.repositoryProperty.findOne(id)
    return property
  }

  public async updateProperty(id: string, body: Partial<PropertyModel>) {
    const property = await this.repositoryProperty.update(id, body)
    return property
  }

  public async findBeneficiary(id: string) {
    const beneficiary = await this.repositoryBeneficiary.findOne(id)
    return beneficiary
  }

  public async updateBeneficiary(id: string, body: Partial<BeneficiaryModel>) {
    const beneficiary = await this.repositoryBeneficiary.update(id, body)
    return beneficiary
  }

  public async findBusinessInterests(id: string) {
    const beneficiary = await this.repositoryBusinessInterest.findOne(id)
    return beneficiary
  }

  public async updateBusinessInterests(id: string, body: Partial<BeneficiaryModel>) {
    const beneficiary = await this.repositoryBusinessInterest.update(id, body)
    return beneficiary
  }

  public async findInvestment(id: string) {
    const investment = await this.repositoryInvestment.findOne(id)
    return investment
  }

  public async updateInvestment(id: string, body: Partial<InvestmentModel>) {
    const investment = await this.repositoryInvestment.update(id, body)
    return investment
  }

  public async findValuables(id: string) {
    const valuables = await this.repositoryValuables.findOne(id)
    return valuables
  }

  public async updateValuables(id: string, body: Partial<ValuablesModel>) {
    const valuables = await this.repositoryValuables.update(id, body)
    return valuables
  }

  public async findBankAccount(id: string) {
    const bankAccount = await this.repositoryBankAccount.findOne(id)
    return bankAccount
  }

  public async updateBankAccount(id: string, body: Partial<BankAccountModel>) {
    const bankAccount = await this.repositoryBankAccount.update(id, body)
    return bankAccount
  }

  public async findInsurancePolicy(id: string) {
    const insurancePolicy = await this.repositoryInsurancePolicy.findOne(id)
    return insurancePolicy
  }

  public async updateInsurancePolicy(id: string, body: Partial<InsurancePolicyModel>) {
    const insurancePolicy = await this.repositoryInsurancePolicy.update(id, body)
    return insurancePolicy
  }

  public async createBlackList(token: string) {
    const blackList = await this.repositoryBlackList.insert({ token: token })
    return blackList
  }

  public async validateToken(token: string) {
    const blackList = await this.repositoryBlackList.count({ token: token })
    if (blackList > 0) {
      return false
    }
    return true
  }

  public async findRole(option: any) {
    const role = await this.repositoryRole.findOne(option)
    return role
  }

  public async findUserCategoriesDetail(id: string) {
    const user = await this.userRepositoryService.findUserCategoriesDetail(id)
    return user
  }

  public async getAll(options: IPaginationOptions, role_id: any, notShows: string[]) {
    return this.userRepositoryService.paginate(options, role_id, notShows)
  }

  public async findUserDetail(id: string) {
    return this.userRepositoryService.findUserDetail(id)
  }

  public async checkEmailExists(userId: string, new_email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :userId', { userId })
      .andWhere('user.email = :new_email', { new_email })
      .getOne()
  }

}

