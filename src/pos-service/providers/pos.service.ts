import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/pos-manage/providers';
import { SubmitOrderDto } from '../dto/order.dto';
import { RaptorAuthenInterFace, RaptorOpenTableInterface, RaptorOpenTableResponseInterface, RaptorOrderItemInterface, RaptorRecallTableInterface, RaptorRecallTableResponseInterface, RaptorTableDetailInterface } from '../dto/raptor.dto';
import { raptorApiService } from './api/Raptor/RaptorApiService';

@Injectable()
export class PosService {
  constructor(private posManager: CrudService) { }

  public async submitOrder(orderInfo: SubmitOrderDto) {
    const posInfo = await this.posManager.findByOutletId(orderInfo?.outletId);
    if (posInfo) {
      console.log("co pos info")
      const { pos_id: posId } = posInfo;
      const raptorUsername = process.env.RAPTOR_USERNAME;
      const raptorPassword = process.env.RAPTOR_PASSWORD;
      if (raptorUsername && raptorPassword) {
        const data: RaptorAuthenInterFace = {
          username: raptorUsername,
          password: raptorPassword,
        }
        const response = await this.authenWithRaptor(data);
        if (response) {
          const token: string = response[0]?.access_token;
          const [tablesOpenList, _err, _message] = await raptorApiService.getListTableOpen(token);
          if (tablesOpenList) {
            const { details: tablesDetail } = tablesOpenList;
            const { tableId } = orderInfo;
            if (tableId) {
              console.log('ttableId', tableId)
              const tableFound: RaptorTableDetailInterface | undefined = tablesDetail.find((tableDetail: RaptorTableDetailInterface) => tableDetail.tablename === tableId);
              if (tableFound) {
                console.log("table found", tableFound)
                const [response, _error, _message] = await this.recallTable(token, tableFound, posId as string);
                console.log("response order item", _error)
                if (response) {
                  await this.orderItem(token, posId as string, response, orderInfo?.tableId);
                }
              } else {
                const [tableDataRes, _error, _message] = await this.openTable(token, orderInfo, posId as string);
                console.log("response order item", _error)
                if (tableDataRes) {
                  await this.orderItem(token, posId as string, tableDataRes, orderInfo?.tableId);
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  private async orderItem(token: string, posId: string, tableData: RaptorOpenTableResponseInterface | RaptorRecallTableResponseInterface, tableName: string) {
    const dataOrder: RaptorOrderItemInterface = {
      token,
      posid: `pos00${posId}`,
      item_qty: 1,
      sales_category: 0,
      operator: 1,
      salesno: tableData.salesno,
      splitno: tableData.splitno,
      tablename: tableName,
    };
    console.log("data order", dataOrder)
    const [response, error, message] = await raptorApiService.orderItem(dataOrder);
    console.log("response khi orderitem", response)
    return [response, error, message];
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

  private async openTable(token: string, orderInfo: SubmitOrderDto, posId: string): Promise<[RaptorOpenTableResponseInterface, Error, string]> {
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

  async authenWithRaptor(raptorAuthenInfo: RaptorAuthenInterFace) {
    const { username, password } = raptorAuthenInfo;
    const result = await raptorApiService.authenticate({ username, password });
    return result;
  }

  public async viewBill() {
  }
}
