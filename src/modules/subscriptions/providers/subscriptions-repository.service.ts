import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsModel } from 'src/entity/subscriptions';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class SubscriptionsRepository {
    constructor(
        @InjectRepository(SubscriptionsModel)
        private repository: Repository<SubscriptionsModel>,
    ) { }

    public async findAll(): Promise<SubscriptionsModel[]> {
        return this.repository.find()
    }

    public async create(data: Partial<SubscriptionsModel>): Promise<SubscriptionsModel> {
        return this.repository.save(data);
    }


    public async update(id: string, data: Partial<SubscriptionsModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string, options: any = {}): Promise<SubscriptionsModel | undefined> {
        return this.repository.findOneOrFail(id, options)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    public async findOne(options: any): Promise<SubscriptionsModel | undefined> {
        return this.repository.findOne(options);

    }
}
