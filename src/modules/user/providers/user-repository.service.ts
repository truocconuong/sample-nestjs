import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/entity/user';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

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


    public async update(id: number, data: Partial<UserModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string): Promise<UserModel | undefined> {
        return this.repository.findOne({
            id
        })
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
