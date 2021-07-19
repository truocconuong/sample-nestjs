import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/entity/user';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import {
    paginate,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserRepositoryService {
    constructor(
        @InjectRepository(UserModel)
        private repository: Repository<UserModel>,
    ) { }

    public async findAll(): Promise<UserModel[]> {
        return this.repository.find()
    }

    public async create(data: Partial<UserModel>): Promise<UserModel> {
        return this.repository.save(data);
    }


    public async update(id: string, data: Partial<UserModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string, options: any = {}): Promise<UserModel | undefined> {
        return this.repository.findOneOrFail(id, options)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    public async findOne(options: any): Promise<UserModel | undefined> {
        return this.repository.findOne(options);
    }

    async findUserCategoriesDetail(id: string){
        const queryBuilder = await this.repository
                                   .createQueryBuilder('user')
                                   .leftJoinAndSelect('user.investments', 'investments')
                                   .leftJoinAndSelect('user.insurance_policies', 'insurance_policies')
                                   .leftJoinAndSelect('user.properties', 'properties')
                                   .leftJoinAndSelect('user.business_interests', 'business_interests')
                                   .leftJoinAndSelect('user.valuables', 'valuables')
                                   .leftJoinAndSelect('user.executors', 'executors')
                                   .leftJoinAndSelect('user.beneficiaries', 'beneficiaries')
                                   .leftJoinAndSelect('user.bank_accounts', 'bank_accounts')
                                   .where('user.id = :id', { id: id})
                                   .getOne()
        return queryBuilder
    }

    async paginate(options: IPaginationOptions, role_id: any){
        const queryBuilder = await this.repository
        .createQueryBuilder('user')
        .where("user.role_id = :role_id", { role_id: role_id })
        return await paginate<UserModel>(queryBuilder, options)
    }

    async findUserDetail(id: string){
        const queryBuilder = await this.repository
                                   .createQueryBuilder('user')
                                   .innerJoinAndSelect('user.subscriptions','subscriptions')
                                   .innerJoinAndSelect('user.orders', 'orders')
                                   .where('user.id = :id', { id: id})
                                   .getOne()
        return queryBuilder
    }
}
