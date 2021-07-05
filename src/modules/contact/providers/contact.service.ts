import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactModel } from 'src/entity/contact';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ContactRepositoryService } from './contact-repository.service';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactModel)
        private readonly contactRepositoryService: ContactRepositoryService,

    ) { }

    public async findAll(): Promise<ContactModel[]> {
        return this.contactRepositoryService.findAll();
    }

    public async create(data: Partial<ContactModel>): Promise<ContactModel> {
        return this.contactRepositoryService.create(data);
    }


    public async update(id: number, data: Partial<ContactModel>): Promise<UpdateResult> {
        return this.contactRepositoryService.update(id, data);
    }

    public async findById(id: string): Promise<ContactModel | undefined> {
        return this.contactRepositoryService.findById(id)
    }

    public async remove(id: string): Promise<DeleteResult> {
        return this.contactRepositoryService.remove(id);
    }
}
