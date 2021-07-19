import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemParameterModel } from 'src/entity/system-parameter';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class SystemParameterRepositoryService {
    constructor(
        @InjectRepository(SystemParameterModel)
        private repository: Repository<SystemParameterModel>,
    ) { }

    public async findAll(): Promise<SystemParameterModel[]> {
        return this.repository.find()
    }

    public async create(data: Partial<SystemParameterModel>): Promise<SystemParameterModel> {
        return this.repository.save(data);
    }


    public async update(id: string, data: Partial<SystemParameterModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string): Promise<SystemParameterModel | undefined> {
        return this.repository.findOne({
            id
        })
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    public async findOne(option: {}){
        return this.repository.findOne(option)
    }
}
