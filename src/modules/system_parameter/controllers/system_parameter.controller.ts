import { Controller, Get, UseInterceptors, Param, NotFoundException, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { SystemParameterModel } from 'src/entity/system-parameter';
import { SystemParameterService } from '../providers/system_parameter.service';
import { UpdateSystemParameterDto } from '../dto/update-system-parameter.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../../auth/guards/role.guard'
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('system-parameter')
export class SystemParameterController {
    constructor(private systemParameterService: SystemParameterService) { }
    @Get()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async getAll(): Promise<SystemParameterModel[]> {
        const result = await this.systemParameterService.findAll();
        return result;
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async getUserById(@Param('id') id: string): Promise<SystemParameterModel> {
        try {
            const result = await this.systemParameterService.findById(id);
            if (!result) {
                throw new NotFoundException('Not found !')
            }
            return result;
        } catch (error) {
            throw error
        }
    }

    @Post()
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async create(@Body() body: Partial<SystemParameterModel>): Promise<SystemParameterModel | undefined> {
        const information = {
            type: body.type,
            value: body.value
        }
        const systemParameter = await this.systemParameterService.create(information)
        return systemParameter
    }

    @Patch(':id')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async update(@Body() body: UpdateSystemParameterDto, @Param('id') id: string): Promise<boolean> {
        await this.systemParameterService.update(id, body)
        return true
    }
}
