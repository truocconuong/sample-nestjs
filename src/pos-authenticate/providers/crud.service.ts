import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PosAuthenticateModel } from 'src/entity/pos-authenticate';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(PosAuthenticateModel)
    private table: Repository<PosAuthenticateModel>,
  ) { }

  public async findAll(): Promise<PosAuthenticateModel[]> {
    return this.table.find();
  }

  public async create(data: Partial<PosAuthenticateModel>): Promise<PosAuthenticateModel> {
    return this.table.save(data);
  }

  public async read(id: number): Promise<PosAuthenticateModel | undefined> {
    console.log('chay vao day')
    return this.table.findOne(id);
  }

  public async findByClientId(client_id: string): Promise<PosAuthenticateModel | undefined> {
    return this.table.findOne({
      where : {
        client_id
      }
    });
  }

  public async update(id: number, data: Partial<PosAuthenticateModel>): Promise<UpdateResult> {
    return this.table.update(id, data);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.table.delete(id);
  }
}
