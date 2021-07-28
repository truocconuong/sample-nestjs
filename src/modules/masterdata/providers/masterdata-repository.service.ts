import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterDataModel } from 'src/entity/master_data';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class MasterDataRepositoryService {
    constructor(
        @InjectRepository(MasterDataModel)
        private repository: Repository<MasterDataModel>,
    ) { }

    public async findAll(where : any): Promise<MasterDataModel[]> {
        return this.repository.find(where)
    }

    public async create(data: Partial<MasterDataModel>): Promise<MasterDataModel> {
        return this.repository.save(data);
    }


    public async update(id: number, data: Partial<MasterDataModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string): Promise<MasterDataModel | undefined> {
        return this.repository.findOne({
            id
        })
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }
}
