import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactModel } from 'src/entity/contact';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class ContactRepositoryService {
    constructor(
        @InjectRepository(ContactModel)
        private repository: Repository<ContactModel>,
    ) { }

    public async findAll(): Promise<ContactModel[]> {
        return this.repository.find()
    }

    public async create(data: Partial<ContactModel>): Promise<ContactModel> {
        return this.repository.save(data);
    }


    public async update(id: number, data: Partial<ContactModel>): Promise<UpdateResult> {
        return this.repository.update(id, data);
    }

    public async findById(id: string): Promise<ContactModel | undefined> {
        return this.repository.findOne({
            id
        })
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    public async findOne(options: any): Promise<ContactModel | undefined> {
        return this.repository.findOne(options);

    }
}
