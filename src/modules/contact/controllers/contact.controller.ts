import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { ContactModel } from 'src/entity/contact';
import { CreateContactDto } from '../dto/create-contact.dto';
import { ContactLoggerExceptionsFilter } from '../exceptions/contact.exceptions';
import { ContactService } from '../providers';

@Controller('contacts')
export class ContactController {
    constructor(private contactService: ContactService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    @UseFilters(ContactLoggerExceptionsFilter)
    public async getAll(): Promise<ContactModel[]> {
        const result = await this.contactService.findAll();
        return result;
    }


    @Get(':id')
    @UseInterceptors(TransformInterceptor)
    public async getUserById(@Param('id') id: string): Promise<ContactModel> {
        try {
            const result = await this.contactService.findById(id);
            if (!result) {
                throw new NotFoundException('Not found !')
            }
            return result;
        } catch (error) {
            throw error
        }
    }

    @Post()
    @UseInterceptors(TransformInterceptor)
    public async create(@Body() body: CreateContactDto): Promise<ContactModel | undefined> {
        const result = await this.contactService.create(body);
        return result
    }


    @Delete()
    @UseInterceptors(TransformInterceptor)
    public async destroy(@Param('id') id: string): Promise<boolean> {
        try {
            const result = await this.contactService.remove(id);
            if (!result) {
                throw new NotFoundException('Not found !')
            }
            return true;
        } catch (error) {
            throw error
        }
    }
}
