import { Body, Controller, Post } from '@nestjs/common';
import { SubmitOrderDto } from '../dto/order.dto';
import { PosService } from '../providers/pos.service';
/**
 * route /test/crud/*
 */
@Controller('order')
export class PosController {
  constructor(private posService: PosService) { }

  @Post('/submit')
  public async submit(@Body() orderData: SubmitOrderDto) {
    const result = await this.posService.submitOrder(orderData);
    return result;
  }

  // @Get('/bill')
  // public async viewBill(@Body() body: CreateDto): Promise<{ id: number }> {
  //   const result = await this.crud.create(body);
  //   if (!result.id) {
  //     throw new InternalServerErrorException('NotCreatedData');
  //   }

  //   return { id: result.id };
  // }
}
