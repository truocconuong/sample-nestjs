import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PocManageModel } from 'src/entity/pos-manage';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(PocManageModel)
    private table: Repository<PocManageModel>,
  ) { }

  public async findAll(): Promise<PocManageModel[]> {
    return this.table.find();
  }

  public async create(data: Partial<PocManageModel>): Promise<PocManageModel> {
    return this.table.save(data);
  }

  public async read(id: number): Promise<PocManageModel | undefined> {
    return this.table.findOne(id);
  }

  public async update(id: number, data: Partial<PocManageModel>): Promise<UpdateResult> {
    return this.table.update(id, data);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.table.delete(id);
  }
}
