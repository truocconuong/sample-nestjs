import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticateClientGuard } from 'src/auth';
import { GetInfoPosDto, SubmitOrderDto, UpdateTableDto, ViewBillOrderDto } from '../dto/order.dto';
import { PosService } from '../providers/pos.service';

@Controller('order')
export class PosController {
  constructor(private posService: PosService) { }

  @Post('/submit')
  @UseGuards(AuthenticateClientGuard)
  public async submit(@Body() orderData: SubmitOrderDto) {
    const result = await this.posService.submitOrder(orderData);
    return result;
  }

  @Post('/updateTable')
  @UseGuards(AuthenticateClientGuard)
  public async updateTable(@Body() updateTableRequest: UpdateTableDto) {
    const result = await this.posService.updateTable(updateTableRequest);
    return result;
  }

  @Post('/getInfoPos')
  @UseGuards(AuthenticateClientGuard)
  public async getInfoPos(@Body() request: GetInfoPosDto) {
    const result = await this.posService.getInfoPos(request);
    return result;
  }

  @Get('/bill')
  @UseGuards(AuthenticateClientGuard)
  public async viewBill(@Body() dataRequest: ViewBillOrderDto) {
    const result = await this.posService.viewBill(dataRequest);
    return result;
  }

  @Post('/closeSession')
  public async closeSession(@Body() dataRequest: any) {
    console.log("dataRequest", dataRequest)
    return null;
  }
}
