import { Controller,  UseGuards, UseInterceptors, DefaultValuePipe, ParseIntPipe, Get, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { SubscripionsService } from '../providers/subscriptions.service';
import { LIMIT_SUBSCRIPTIONS } from 'src/common/constants/index';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('subscriptions')
export class SubscriptionsAdminController {
    constructor(private subscripionsService: SubscripionsService) { }
    
    @Get()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async index(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(LIMIT_SUBSCRIPTIONS), ParseIntPipe) limit: number = LIMIT_SUBSCRIPTIONS,
    ){
      limit = limit > 100 ? 100 : limit;
      return this.subscripionsService.getAll({
        page,
        limit,
      });
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getSubscriptionDetail(@Param('id') id: string){
        const subscription = await this.subscripionsService.findById(id)
        return subscription
    }
}
