import { Injectable } from '@nestjs/common';
import { SubscriptionsModel } from 'src/entity/subscriptions';
import { UpdateResult, DeleteResult } from 'typeorm';
import { SubscriptionsRepository} from './subscriptions-repository.service';

@Injectable()
export class SubscripionsService {
    constructor(
        private readonly subscriptionsRepository: SubscriptionsRepository,
    ) { }

    public async findAll(): Promise<SubscriptionsModel[]> {
        return this.subscriptionsRepository.findAll();
    }

    public async create(data: Partial<SubscriptionsModel>): Promise<SubscriptionsModel> {
        return this.subscriptionsRepository.create(data);
    }


    public async update(id: string, data: Partial<SubscriptionsModel>): Promise<UpdateResult> {
        return this.subscriptionsRepository.update(id, data);
    }

    public async findById(id: string): Promise<SubscriptionsModel | undefined> {
        return this.subscriptionsRepository.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.subscriptionsRepository.remove(id);
    }


}
