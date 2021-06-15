import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticateClientGuard } from 'src/auth';
import { GetInfoPosDto, SubmitOrderDto, UpdateTableDto, ViewBillOrderDto } from '../dto/order.dto';
import { PosService } from '../providers/pos.service';

@Controller()
export class PosController {
  constructor(private posService: PosService) { }

  @Post('order/submit')
  @UseGuards(AuthenticateClientGuard)
  public async submit(@Body() orderData: SubmitOrderDto) {
    const result = await this.posService.submitOrder(orderData);
    return result;
  }

  @Post('order/bill')
  @UseGuards(AuthenticateClientGuard)
  public async viewBill(@Body() dataRequest: ViewBillOrderDto) {
    const result = await this.posService.viewBill(dataRequest);
    return result;
  }

  @Post('table/update')
  @UseGuards(AuthenticateClientGuard)
  public async updateTable(@Body() updateTableRequest: UpdateTableDto) {
    const result = await this.posService.updateTable(updateTableRequest);
    return result;
  }

  @Post('pos/info')
  @UseGuards(AuthenticateClientGuard)
  public async getInfoPos(@Body() request: GetInfoPosDto) {
    const result = await this.posService.getInfoPos(request);
    return result;
  }

  @Post('payment/close_Session')
  public async closeSession(@Body() dataRequest: any) {
    console.log("dataRequest", dataRequest)
    return null;
  }
}
