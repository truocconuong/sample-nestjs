import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash'
import { LIMIT_PROMOTION } from 'src/common/constants';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { CreatePromocodeDto } from '../dto/create-promocode.dto';
import { PromocodesService } from '../providers';

@Controller('admin/promocodes')
export class PromocodesAdminController {
  constructor(private promocodesService: PromocodesService, private stripeService: StripeService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
  @UseInterceptors(TransformInterceptor)
  async getAllPromocode(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(LIMIT_PROMOTION), ParseIntPipe) limit: number = LIMIT_PROMOTION,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.promocodesService.getAll({
      page,
      limit,
    });
  }


  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard(['admin']))
  @UseInterceptors(TransformInterceptor)
  async createPromocode(@Body() body: CreatePromocodeDto) {
    const { name, percent, type } = body;
    const checkPromocodeExist = await this.promocodesService.findDetailPromocodesByName(name);
    if (checkPromocodeExist) {
      throw new HttpException('Promo code exists', HttpStatus.CONFLICT)
    }

    const dataPromocodeToStripe = {
      name,
      currency: "usd",
      duration: type,
      percent_off: percent,
    }

    const couponStripe = await this.stripeService.createCoupon(
      dataPromocodeToStripe
    )

    if (couponStripe) {
      await this.promocodesService.create(body)
    }
    return couponStripe
  }

}
