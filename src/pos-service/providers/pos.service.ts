import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CrudService } from 'src/pos-manage/providers';
import { SubmitOrderDto, UpdateTableDto } from '../dto/order.dto';
import { RaptorAuthenInterFace, RaptorOpenTableInterface, RaptorOpenTableResponseInterface, RaptorOrderItemInterface, RaptorPrepItemInterface, RaptorPrintBillInterface, RaptorRecallTableInterface, RaptorRecallTableResponseInterface, RaptorTableDetailInterface, SubmitOrderResponseInterface, ViewBillDataRequest } from '../dto/raptor.dto';
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
      const [response, _error, _message] = await raptorApiService.orderItem(dataOrder);
      if (item.selectedOptions) {
        item.selectedOptions.map(async (option: ItemSelectedOptionsInterface) => {
          const optionsData: RaptorPrepItemInterface = {
            ...dataOrder,
            pluSalesRef: response.pluSalesRef
          }
          if (option.price > 0) {
            raptorApiService.prepItem(optionsData);
          } else {
            raptorApiService.modifyItem(optionsData);
          }
        })
      }
    })
    return [];
  }

  public async updateTable(updateTableInfo: UpdateTableDto): Promise<SubmitOrderResponseInterface | Error> {
    this.validateTableInfo(updateTableInfo);
    const posInfo = await this.posManager.findByOutletId(updateTableInfo?.outletId);
    const updateTableRes: SubmitOrderResponseInterface = {
      success: true,
      data: {}
    };
    const { data } = updateTableRes;
    if (!posInfo) {
      throw new HttpException('POS not found.', HttpStatus.BAD_REQUEST);
    }
    const { pos_id: posId } = posInfo;
    data.posId = posId;
    data.operator = 1;
    const token: string = await this.getPosToken();
    const [tablesOpenList, errTableOpenList, _message] = await raptorApiService.getListTableOpen(token);
    if (errTableOpenList) {
      throw new HttpException(errTableOpenList.message, HttpStatus.BAD_REQUEST);
    }
    const { details: tablesDetail } = tablesOpenList;
    const { tableId } = updateTableInfo;

    data.tableName = tableId;
    const tableFound: RaptorTableDetailInterface | undefined = tablesDetail.find((tableDetail: RaptorTableDetailInterface) => tableDetail.tablename === tableId);
    if (tableFound) {
      const [_response, errorRecallTable, _message] = await this.recallTable(token, tableFound, posId as string);
      if (errorRecallTable) {
        throw new HttpException(errorRecallTable.message, HttpStatus.BAD_REQUEST);
      }
      data.salesNo = tableFound.salesno;
      data.splitNo = tableFound.splitno;

    } else {
      const [tableDataRes, errorOpenTable, _message] = await this.openTable(token, updateTableInfo, posId as string);
      if (errorOpenTable) {
        throw new HttpException(errorOpenTable.message, HttpStatus.BAD_REQUEST);
      }
      data.salesNo = tableDataRes.salesno;
      data.splitNo = tableDataRes.splitno;
    }

    return updateTableRes;
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
        const token: string = response[0]?.access_token;
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
    const result = await raptorApiService.authenticate({ username, password });
    return result;
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
      const token: string = authenRes[0]?.access_token;
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
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
      return billData;
    }
    return [];
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
}