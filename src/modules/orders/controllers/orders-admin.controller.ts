import { Controller,  UseGuards, UseInterceptors, DefaultValuePipe, ParseIntPipe, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { OrdersService } from '../providers/orders.service';
import { LIMIT_ORDER } from 'src/common/constants/index';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('orders')
export class SubscriptionsAdminController {
    constructor( private orderService: OrdersService ) { }
    
    @Get()
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
    @UseInterceptors(TransformInterceptor)
    async getAllOrder(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(LIMIT_ORDER), ParseIntPipe) limit: number = LIMIT_ORDER,
    ){
      limit = limit > 100 ? 100 : limit;
      return this.orderService.getAll({
        page,
        limit,
      });
    }
}
