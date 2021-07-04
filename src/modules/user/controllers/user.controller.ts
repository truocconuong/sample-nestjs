import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { CreateUserGuestDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserLoggerExceptionsFilter } from '../exceptions/user.exceptions';
import { UserService } from '../providers/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get()
    @UseInterceptors(TransformInterceptor)
    @UseFilters(UserLoggerExceptionsFilter)
    public async getAll(): Promise<UserModel[]> {
        const result = await this.userService.findAll();
        return result;
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

    @Post('guest')
    @UseInterceptors(TransformInterceptor)
    public async create(@Body() body: CreateUserGuestDto): Promise<boolean> {
        console.log(body)
        try {
            // const result = await this.userService.create(body);
            return true;
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
