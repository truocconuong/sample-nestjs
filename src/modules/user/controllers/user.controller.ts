import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../providers/user.service';

@Controller('users')
export class CrudController {
    constructor(private userService: UserService) { }

    @Get()
    @UseInterceptors(TransformInterceptor)
    public async getAll(): Promise<UserModel[]> {
        try {
            const result = await this.userService.findAll();
            return result;
        } catch (error) {
            throw error
        }
    }

    @Get(':id')
    @UseInterceptors(TransformInterceptor)
    public async getUserById(@Param('id') id: string): Promise<UserModel> {
        try {
            const result = await this.userService.findById(id);
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
    public async create(@Body() body: CreateUserDto): Promise<UserModel> {
        try {
            const result = await this.userService.create(body);
            return result;
        } catch (error) {
            throw error
        }
    }

    @Patch()
    @UseInterceptors(TransformInterceptor)
    public async update(@Body() body: UpdateUserDto): Promise<UserModel> {
        try {
            const result = await this.userService.create(body);
            return result;
        } catch (error) {
            throw error
        }
    }

    @Delete()
    @UseInterceptors(TransformInterceptor)
    public async destroy(@Param('id') id: string): Promise<boolean> {
        try {
            const result = await this.userService.remove(id);
            if (!result) {
                throw new NotFoundException('Not found !')
            }
            return true;
        } catch (error) {
            throw error
        }
    }
}
