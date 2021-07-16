import { Injectable } from '@nestjs/common';
import { SystemParameterModel } from 'src/entity/system-parameter';
import { UpdateResult, DeleteResult } from 'typeorm';
import { SystemParameterRepositoryService } from './system_parameter-repository.service';

@Injectable()
export class SystemParameterService {
    constructor(
        private readonly SystemParameterRepositoryService: SystemParameterRepositoryService,

    ) { }

    public async findAll(): Promise<SystemParameterModel[]> {
        return this.SystemParameterRepositoryService.findAll();
    }

    public async create(data: Partial<SystemParameterModel>): Promise<SystemParameterModel> {
        return this.SystemParameterRepositoryService.create(data);
    }


    public async update(id: string, data: Partial<SystemParameterModel>): Promise<UpdateResult> {
        return this.SystemParameterRepositoryService.update(id, data);
    }

    public async findById(id: string): Promise<SystemParameterModel | undefined> {
        return this.SystemParameterRepositoryService.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.SystemParameterRepositoryService.remove(id);
    }
}
