import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/entity/user';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserRepositoryService } from './user-repository.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService,

    ) { }

    public async findAll(): Promise<UserModel[]> {
        return this.userRepositoryService.findAll();
    }

    public async create(data: Partial<UserModel>): Promise<UserModel> {
        return this.userRepositoryService.create(data);
    }


    public async update(id: number, data: Partial<UserModel>): Promise<UpdateResult> {
        return this.userRepositoryService.update(id, data);
    }

    public async findById(id: string): Promise<UserModel | undefined> {
        return this.userRepositoryService.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.userRepositoryService.remove(id);
    }
}
