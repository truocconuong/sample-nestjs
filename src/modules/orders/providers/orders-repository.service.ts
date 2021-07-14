import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersModel } from 'src/entity/orders';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(OrdersModel)
        private orderRepository: Repository<OrdersModel>,
    ) { }

    public async findAll(): Promise<OrdersModel[]> {
        return this.orderRepository.find()
    }

    public async create(data: OrdersModel): Promise<OrdersModel> {
        console.log('hôh')
        return this.orderRepository.save(data);
    }


    public async update(id: string, data: Partial<OrdersModel>): Promise<UpdateResult> {
        return this.orderRepository.update(id, data);
    }

    public async findById(id: string): Promise<OrdersModel | undefined> {
        return this.orderRepository.findOne({
            id
        })
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.orderRepository.delete(id);
    }

    public async findOne(options: any): Promise<OrdersModel | undefined> {
        return this.orderRepository.findOne(options);

    }
}
