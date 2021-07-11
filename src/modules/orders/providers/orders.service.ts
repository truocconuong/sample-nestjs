import { Injectable } from '@nestjs/common';
import { OrdersModel } from 'src/entity/orders';
import { UpdateResult, DeleteResult } from 'typeorm';
import { OrdersRepository } from './orders-repository.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
    ) { }

    public async findAll(): Promise<OrdersModel[]> {
        return this.ordersRepository.findAll();
    }

    public async create(data: OrdersModel): Promise<OrdersModel> {
        return this.ordersRepository.create(data)
    }


    public async update(id: string, data: Partial<OrdersModel>): Promise<UpdateResult> {
        return this.ordersRepository.update(id, data);
    }

    public async findById(id: string): Promise<OrdersModel | undefined> {
        return this.ordersRepository.findById(id)
    }

    public async findOne(options: any): Promise<OrdersModel | undefined> {
        return this.ordersRepository.findOne(options)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.ordersRepository.remove(id);
    }
}
