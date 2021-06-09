import { Injectable } from '@nestjs/common';
import { SubmitOrderDto } from '../dto/order.dto';
import { RaptorAuthenInterFace, RaptorOpenTableInterface, RaptorRecallTableInterface, RaptorTableDetailInterface } from '../dto/raptor.dto';
import { raptorApiService } from './api/Raptor/RaptorApiService';

@Injectable()
export class PosService {

  public async submitOrder(orderInfo: SubmitOrderDto) {
    const raptorUsername = process.env.RAPTOR_USERNAME;
    const raptorPassword = process.env.RAPTOR_PASSWORD;
    console.log("raptor username", raptorUsername)
    console.log("raptor password", raptorPassword)
    if(raptorUsername && raptorPassword){
      const data: RaptorAuthenInterFace = {
        username: raptorUsername,
        password: raptorPassword,
      }
      const response = await this.authenWithRaptor(data);
      if(response){
       const token: string = response[0]?.access_token;
        const [tablesOpenList, _err, _message] = await raptorApiService.getListTableOpen(token);
        if(tablesOpenList){
          const { details: tablesDetail } = tablesOpenList;
          const {tableId} = orderInfo;
          if(tableId){
            const found: RaptorTableDetailInterface | undefined = tablesDetail.find((tableDetail: RaptorTableDetailInterface) => tableDetail.tablename === tableId);
            if(found){
              this.recallTable(token, found, "pos001");
            }else{
              this.openTable(token, orderInfo, "pos001");
            }
          }
        }
      }
    }
   return null;
  }

  private recallTable(token: string, tableDetail: RaptorTableDetailInterface, posId: string = 'pos001') {
    const dataRecallTable: RaptorRecallTableInterface = {
      token,
      ...tableDetail,
      operator: 1,
      posid: posId
    };
    raptorApiService.recallTable(dataRecallTable);
  }

  private openTable(token: string, orderInfo: SubmitOrderDto, posId: string = 'pos001') {
    const {remarks, tableId} = orderInfo;
    const dataOpenTable: RaptorOpenTableInterface = {
      token,
      tablename: tableId,
      posid: posId,
      operator: 1,
      cover: 1,
      orderremark: remarks
    };
    raptorApiService.openTable(dataOpenTable);
  }

  async authenWithRaptor(raptorAuthenInfo: RaptorAuthenInterFace) {
    const {username, password} = raptorAuthenInfo;
    const result = await raptorApiService.authenticate({username, password});
    return result;
  }

  public async viewBill(){
  }
}
