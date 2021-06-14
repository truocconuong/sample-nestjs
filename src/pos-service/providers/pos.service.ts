import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CrudService } from 'src/pos-manage/providers';
import { GetInfoPosDto, SubmitOrderDto, UpdateTableDto } from '../dto/order.dto';
import { PosInfoResponseInferface, RaptorAuthenInterFace, RaptorOpenTableInterface, RaptorOpenTableResponseInterface, RaptorOrderItemInterface, RaptorPrepItemInterface, RaptorPrintBillInterface, RaptorRecallTableInterface, RaptorRecallTableResponseInterface, RaptorTableDetailInterface, SubmitOrderResponseInterface, ViewBillDataRequest } from '../dto/raptor.dto';
import { raptorApiService } from './api/Raptor/RaptorApiService';
import { ItemInterface, ItemSelectedOptionsInterface } from '../dto/order.dto';
@Injectable()
export class PosService {
  constructor(private posManager: CrudService) { }

  public async submitOrder(orderInfo: SubmitOrderDto): Promise<SubmitOrderResponseInterface | Error> {
    this.validateOrderRequest(orderInfo);
    const token: string = await this.getPosToken();
    const submitOrderRes: SubmitOrderResponseInterface = {
      success: true,
      data: {}
    };
    await this.orderItems(token, orderInfo);
    return submitOrderRes;
  }

  private async orderItems(token: string, orderInfo: SubmitOrderDto) {
    const { posId, tableName, splitNo, salesNo, items } = orderInfo;
    const dataOrder: RaptorOrderItemInterface = {
      token,
      posid: `pos00${posId}`,
      item_qty: 1,
      sales_category: 0,
      operator: 1,
      salesno: salesNo,
      splitno: splitNo,
      tablename: tableName,
    };
    items.map(async (item: ItemInterface) => {
      dataOrder.pluno = this.toPlunoString(posId);
      const [response, error, _message] = await raptorApiService.orderItem(dataOrder);
      if (error) {
        throw new HttpException(this.buildRaptorMessageError(error), HttpStatus.BAD_REQUEST);
      }
      if (item.selectedOptions) {
        item.selectedOptions.map(async (option: ItemSelectedOptionsInterface) => {
          const optionsData: RaptorPrepItemInterface = {
            ...dataOrder,
            pluSalesRef: response.pluSalesRef
          }
          const [_res, err, _message] = option.price > 0 ? await raptorApiService.prepItem(optionsData)
            : await raptorApiService.modifyItem(optionsData);

          if (err) {
            throw new HttpException(this.buildRaptorMessageError(error), HttpStatus.BAD_REQUEST);
          }
        })
      }
    })
    return [];
  }

  public async updateTable(updateTableInfo: UpdateTableDto): Promise<SubmitOrderResponseInterface | Error> {
    this.validateTableInfo(updateTableInfo);
    const updateTableRes: SubmitOrderResponseInterface = {
      success: true,
      data: {}
    };
    const { data } = updateTableRes;
    const posId = await this.getPosInfoByOutletId(updateTableInfo.outletId);

    data.posId = posId as unknown as string;
    data.operator = 1;
    const { tableId } = updateTableInfo;
    data.tableName = tableId;

    const { tableFound, token }: { tableFound: RaptorTableDetailInterface | undefined; token: string; } = await this.findTableById(tableId);
    console.log("tableFound", tableFound)
    if (tableFound) {
      const [_response, errorRecallTable, _message] = await this.recallTable(token, tableFound, posId as unknown as string);
      console.log(errorRecallTable)
      if (errorRecallTable) {
        throw new HttpException(this.buildRaptorMessageError(errorRecallTable), HttpStatus.BAD_REQUEST);
      }
      data.salesNo = tableFound.salesno;
      data.splitNo = tableFound.splitno;

    } else {
      const [tableDataRes, errorOpenTable, _message] = await this.openTable(token, updateTableInfo, posId as unknown as string);
      if (errorOpenTable) {
        throw new HttpException(this.buildRaptorMessageError(errorOpenTable), HttpStatus.BAD_REQUEST);
      }
      data.salesNo = tableDataRes.salesno;
      data.splitNo = tableDataRes.splitno;
    }

    return updateTableRes;
  }

  private async findTableById(tableId: string) {
    const token: string = await this.getPosToken();
    const [tablesOpenList, errTableOpenList, _message] = await raptorApiService.getListTableOpen(token);
    console.log("open list", tablesOpenList)
    if (errTableOpenList) {
      throw new HttpException(this.buildRaptorMessageError(errTableOpenList), HttpStatus.BAD_REQUEST);
    }
    const { details: tablesDetail } = tablesOpenList;
    const tableFound: RaptorTableDetailInterface | undefined = tablesDetail.find((tableDetail: RaptorTableDetailInterface) => tableDetail.tablename === tableId);
    return { tableFound, token };
  }

  private async getPosInfoByOutletId(outletId: string) {
    const posInfo = await this.posManager.findByOutletId(outletId);
    if (!posInfo) {
      throw new HttpException('POS not found.', HttpStatus.BAD_REQUEST);
    }
    const { pos_id: posId } = posInfo;
    return posId;
  }

  public async getInfoPos(request: GetInfoPosDto) {
    const { outletId, tableId } = request;
    this.validateGetInfoPosRequest(request);
    const posId = await this.getPosInfoByOutletId(outletId);
    const table = await this.findTableById(tableId);
    const dataRes: PosInfoResponseInferface = {
      posId,
      ...table.tableFound
    };
    return dataRes;
  }

  private async getPosToken() {
    const raptorUsername = process.env.RAPTOR_USERNAME;
    const raptorPassword = process.env.RAPTOR_PASSWORD;
    if (raptorUsername && raptorPassword) {
      const dataAuthen: RaptorAuthenInterFace = {
        username: raptorUsername,
        password: raptorPassword,
      }
      const response = await this.authenWithRaptor(dataAuthen);
      if (response) {
        const token: string = response.access_token;
        return token;
      }
    }
    return "";
  }

  toPlunoString = (itemId: string) => {
    let baseString = "000000000000000";
    let concatedStr = baseString.substr(0, baseString.length - itemId.length)
    return concatedStr + itemId;
  }

  private async recallTable(token: string, tableDetail: RaptorTableDetailInterface, posId: string): Promise<[RaptorRecallTableResponseInterface, Error, string]> {
    const dataRecallTable: RaptorRecallTableInterface = {
      token,
      ...tableDetail,
      operator: 1,
      posid: `pos00${posId}`
    };
    const [response, error, message] = await raptorApiService.recallTable(dataRecallTable);
    return [response, error, message]
  }

  private async openTable(token: string, orderInfo: UpdateTableDto, posId: string): Promise<[RaptorOpenTableResponseInterface, Error, string]> {
    const { remarks, tableId } = orderInfo;
    const dataOpenTable: RaptorOpenTableInterface = {
      token,
      tablename: tableId,
      posid: `pos00${posId}`,
      operator: 1,
      cover: 1,
      orderremark: remarks
    };
    const [response, error, message] = await raptorApiService.openTable(dataOpenTable);
    return [response, error, message];
  }

  private async authenWithRaptor(raptorAuthenInfo: RaptorAuthenInterFace) {
    const { username, password } = raptorAuthenInfo;
    const [res, err, _msg] = await raptorApiService.authenticate({ username, password });
    if (err) {
      throw new HttpException(this.buildRaptorMessageError(err), HttpStatus.BAD_REQUEST);
    }
    return res;
  }

  public async viewBill(billDataRequest: ViewBillDataRequest) {
    const { posId, tableName, salesNo, splitNo, operator } = billDataRequest;
    this.validateBillInfo(billDataRequest);
    const raptorUsername = process.env.RAPTOR_USERNAME;
    const raptorPassword = process.env.RAPTOR_PASSWORD;
    if (raptorUsername && raptorPassword) {
      const dataAuthen: RaptorAuthenInterFace = {
        username: raptorUsername,
        password: raptorPassword,
      }
      const authenRes = await this.authenWithRaptor(dataAuthen);
      const token: string = authenRes?.access_token;
      const dataRequest: RaptorPrintBillInterface = {
        posid: posId as string,
        tablename: tableName as string,
        salesno: salesNo as number,
        splitno: splitNo as number,
        operator: operator as number,
        token
      }
      const [billData, err, _msg] = await raptorApiService.printBill(dataRequest);
      if (err) {
        throw new HttpException(this.buildRaptorMessageError(err), HttpStatus.BAD_REQUEST);
      }
      return billData;
    }
    return [];
  }

  private buildRaptorMessageError = (err: Error) => {
    return `Error from Pos: ${err.message}`;
  }

  private validateTableInfo(tableInfo: UpdateTableDto) {
    const { outletId, tableId } = tableInfo;
    if (!outletId) {
      throw new HttpException('outletId can not null.', HttpStatus.BAD_REQUEST);
    }
    if (!tableId) {
      throw new HttpException('tableId can not null.', HttpStatus.BAD_REQUEST);
    }
  }

  private validateOrderRequest(orderInfo: SubmitOrderDto) {
    const { tableName, salesNo, splitNo, items } = orderInfo;
    if (!salesNo) {
      throw new HttpException('salesNo can not null.', HttpStatus.BAD_REQUEST);
    }

    if (splitNo !== 0 && !splitNo) {
      throw new HttpException('splitNo can not null.', HttpStatus.BAD_REQUEST);
    }

    if (!items || !items?.length) {
      throw new HttpException('items can not empty.', HttpStatus.BAD_REQUEST);
    }
    if (!tableName) {
      throw new HttpException('tableName can not null.', HttpStatus.BAD_REQUEST);
    }
  }

  private validateBillInfo(billDataRequest: ViewBillDataRequest) {
    const { posId, salesNo, splitNo, tableName, operator } = billDataRequest;
    if (!posId) {
      throw new HttpException('posId can not null.', HttpStatus.BAD_REQUEST);
    }
    if (salesNo !== 0 && !salesNo) {
      throw new HttpException('salesNo can not null.', HttpStatus.BAD_REQUEST);
    }
    if (splitNo !== 0 && !splitNo) {
      throw new HttpException('splitNo can not null.', HttpStatus.BAD_REQUEST);
    }
    if (!tableName) {
      throw new HttpException('tableName can not null.', HttpStatus.BAD_REQUEST);
    }
    if (!operator) {
      throw new HttpException('operator can not null.', HttpStatus.BAD_REQUEST);
    }
  }

  private validateGetInfoPosRequest(request: GetInfoPosDto) {
    const { tableId, outletId } = request;
    if (!tableId) {
      throw new HttpException('tableId can not null.', HttpStatus.BAD_REQUEST);
    }
    if (!outletId) {
      throw new HttpException('outletId can not null.', HttpStatus.BAD_REQUEST);
    }
  }
}