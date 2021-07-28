import { Controller,  UseGuards, UseInterceptors, DefaultValuePipe, ParseIntPipe, Get, Query, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { UserService } from '../providers/user.service';
import { ROLE_USER_TITLE, LIMIT_USER } from 'src/common/constants/index';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('admin')
export class SubscriptionsAdminController {
    constructor( private userService: UserService ) { }
    
    @Get('user')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getAllUser(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(LIMIT_USER), ParseIntPipe) limit: number = LIMIT_USER,
      ){
        const role = await this.userService.findRole({title: ROLE_USER_TITLE})
        limit = limit > 100 ? 100 : limit;
        return this.userService.getAll({
          page,
          limit,
        },role!.id);
    }

    @Get('user/:id')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getUserDetail(@Param('id') id: string){
        const UserDetail = await this.userService.findUserDetail(id)
        return UserDetail
    }

    @Patch('user/:id')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    public async updateUserDetail(@Param('id')id: string, @Body() body: UpdateUserDto){
        const user = await this.userService.findById(id)
        if(!user){
            throw new NotFoundException('User Not Found!')
        }
        return await this.userService.update(id, body)
    }
}
