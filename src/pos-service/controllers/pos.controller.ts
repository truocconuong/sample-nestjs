import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubmitOrderDto, ViewBillOrderDto } from '../dto/order.dto';
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

  @Get('/bill')
  public async viewBill(@Body() dataRequest: ViewBillOrderDto) {
    const result = await this.posService.viewBill(dataRequest);
    return result;
  }
}
