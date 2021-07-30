import { Injectable } from '@nestjs/common';
import { ContactModel } from 'src/entity/contact';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateContactDto } from '../dto/create-contact.dto';
import { ContactRepositoryService } from './contact-repository.service';

@Injectable()
export class ContactService {
    constructor(
        private readonly contactRepositoryService: ContactRepositoryService,

    ) { }

    public async findAll(): Promise<ContactModel[]> {
        return this.contactRepositoryService.findAll();
    }

    public async create(data: CreateContactDto): Promise<ContactModel> {
        return  this.contactRepositoryService.create(data);
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
