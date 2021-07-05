import { Injectable } from '@nestjs/common';
import { MasterDataModel } from 'src/entity/master_data';
import { UpdateResult, DeleteResult } from 'typeorm';
import { MasterDataRepositoryService } from './masterdata-repository.service';

@Injectable()
export class MasterdataService {
    constructor(
        private readonly MasterDataRepositoryService: MasterDataRepositoryService,

    ) { }

    public async findAll(): Promise<MasterDataModel[]> {
        return this.MasterDataRepositoryService.findAll();
    }

    public async create(data: Partial<MasterDataModel>): Promise<MasterDataModel> {
        return this.MasterDataRepositoryService.create(data);
    }


    public async update(id: number, data: Partial<MasterDataModel>): Promise<UpdateResult> {
        return this.MasterDataRepositoryService.update(id, data);
    }

    public async findById(id: string): Promise<MasterDataModel | undefined> {
        return this.MasterDataRepositoryService.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.MasterDataRepositoryService.remove(id);
    }
}
