import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CrudService } from "src/pos-manage/providers";
import {
  GetInfoPosDto,
  SubmitOrderDto,
  UpdateTableDto,
} from "../dto/order.dto";
import {
  PosInfoResponseInferface,
  RaptorAuthenInterFace,
  RaptorModifyItemInterface,
  RaptorOpenTableInterface,
  RaptorOpenTableResponseInterface,
  RaptorOrderItemInterface,
  RaptorPrepItemInterface,
  RaptorPrintBillInterface,
  RaptorRecallTableInterface,
  RaptorRecallTableResponseInterface,
  RaptorTableDetailInterface,
  SubmitOrderResponseInterface,
  ViewBillDataRequest,
} from "../dto/raptor.dto";
import { raptorApiService } from "./api/Raptor/RaptorApiService";
import { ItemInterface, ItemSelectedOptionsInterface } from "../dto/order.dto";
enum ResponseType {
  "Raptor" = "Raptor",
  "Middleware" = "Middleware",
}
@Injectable()
export class PosService {
  constructor(private posManager: CrudService) { }

  public async submitOrder(
    orderInfo: SubmitOrderDto
  ): Promise<SubmitOrderResponseInterface | Error> {
    await this.validateOrderRequest(orderInfo);
    const token: string = await this.getPosToken();
    const submitOrderRes: SubmitOrderResponseInterface = {
      success: true,
      data: {},
      type: ResponseType.Middleware,
    };
    await this.orderItems(token, orderInfo);
    return submitOrderRes;
  }

  private async orderItems(token: string, orderInfo: SubmitOrderDto) {
    const {
      posId,
      tableName,
      splitNo,
      salesNo,
      items,
      salesCategory,
      itemQty,
      operator,
      instruction
    } = orderInfo;
    const dataOrder: RaptorOrderItemInterface = {
      token,
      posid: `pos00${posId}`,
      item_qty: itemQty || 1,
      sales_category: salesCategory || 0,
      operator: operator || 1,
      salesno: salesNo,
      splitno: splitNo,
      tablename: tableName,
    };
    await Promise.all(
      items.map(async (item: ItemInterface) => {
        dataOrder.pluno = this.toPlunoString(posId);
        const [response, error, _message] = await raptorApiService.orderItem(
          dataOrder
        );
        if (error) {
          throw new HttpException(
            this.buildRaptorMessageError(error, ResponseType.Raptor),
            HttpStatus.BAD_REQUEST
          );
        }
        if (response.errorcode == 0) {
          throw new HttpException(
            this.buildRaptorMessageError(response.msg, ResponseType.Raptor),
            HttpStatus.BAD_REQUEST
          );
        }
        if (item.selectedOptions) {
          await Promise.all(
            item.selectedOptions.map(
              async (option: ItemSelectedOptionsInterface) => {
                const optionsDataPreps: RaptorPrepItemInterface = {
                  ...dataOrder,
                  pluSalesRef: response.pluSalesRef,
                  qty: itemQty,
                };
                const optionsDataModifier: RaptorModifyItemInterface = {
                  pluSalesRef: response.pluSalesRef,
                  instruction,
                  salesno: salesNo,
                  splitno: splitNo,
                  token,
                  sales_category: salesCategory,
                  posid: posId,
                  operator,
                  tablename: tableName
                };
                const [res, err, _message] =
                  option.price > 0
                    ? await raptorApiService.prepItem(optionsDataPreps)
                    : await raptorApiService.modifyItem(optionsDataModifier);

                if (err) {
                  throw new HttpException(
                    this.buildRaptorMessageError(err, ResponseType.Raptor),
                    HttpStatus.BAD_REQUEST
                  );
                }
                if (res.errorcode == 0) {
                  throw new HttpException(
                    this.buildRaptorMessageError(res.msg, ResponseType.Raptor),
                    HttpStatus.BAD_REQUEST
                  );
                }
              }
            )
          );
        }
      })
    );
    return [];
  }

  public async updateTable(
    updateTableInfo: UpdateTableDto
  ): Promise<SubmitOrderResponseInterface | Error> {
    this.validateTableInfo(updateTableInfo);
    const updateTableRes: SubmitOrderResponseInterface = {
      success: true,
      data: {},
      type: ResponseType.Middleware,
    };
    const { data } = updateTableRes;
    const posId = await this.getPosInfoByOutletId(updateTableInfo.outletId);

    data.posId = posId as unknown as string;
    const { tableId } = updateTableInfo;
    data.tableName = tableId;

    const {
      tableFound,
      token,
    }: { tableFound: RaptorTableDetailInterface | undefined; token: string } =
      await this.findTableById(tableId);
    if (tableFound) {
      const [_response, errorRecallTable, _message] = await this.recallTable(
        token,
        tableFound,
        posId as unknown as string,
        updateTableInfo.operator || 1
      );
      if (errorRecallTable) {
        throw new HttpException(
          this.buildRaptorMessageError(errorRecallTable, ResponseType.Raptor),
          HttpStatus.BAD_REQUEST
        );
      }
      data.salesNo = tableFound.salesno;
      data.splitNo = tableFound.splitno;
    } else {
      const [tableDataRes, errorOpenTable, _message] = await this.openTable(
        token,
        updateTableInfo,
        posId as unknown as string
      );
      if (errorOpenTable) {
        throw new HttpException(
          this.buildRaptorMessageError(errorOpenTable, ResponseType.Raptor),
          HttpStatus.BAD_REQUEST
        );
      }
      data.salesNo = tableDataRes.salesno;
      data.splitNo = tableDataRes.splitno;
    }

    return updateTableRes;
  }

  private async findTableById(tableId: string) {
    const token: string = await this.getPosToken();
    const [tablesOpenList, errTableOpenList, _message] =
      await raptorApiService.getListTableOpen(token);
    if (errTableOpenList) {
      throw new HttpException(
        this.buildRaptorMessageError(errTableOpenList, ResponseType.Raptor),
        HttpStatus.BAD_REQUEST
      );
    }
    const { details: tablesDetail } = tablesOpenList;
    const tableFound: RaptorTableDetailInterface | undefined =
      tablesDetail.find(
        (tableDetail: RaptorTableDetailInterface) =>
          tableDetail.tablename === tableId
      );
    return { tableFound, token };
  }

  private async getPosInfoByOutletId(outletId: string) {
    const posInfo = await this.posManager.findByOutletId(outletId);
    if (!posInfo) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "This outlet has no any POS.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
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
      ...table.tableFound,
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
      };
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
    let concatedStr = baseString.substr(0, baseString.length - itemId.length);
    return concatedStr + itemId;
  };

  private async recallTable(
    token: string,
    tableDetail: RaptorTableDetailInterface,
    posId: string,
    operator: number
  ): Promise<[RaptorRecallTableResponseInterface, Error, string]> {
    const dataRecallTable: RaptorRecallTableInterface = {
      token,
      ...tableDetail,
      operator,
      posid: `pos00${posId}`,
    };
    const [response, error, message] = await raptorApiService.recallTable(
      dataRecallTable
    );
    return [response, error, message];
  }

  private async openTable(
    token: string,
    orderInfo: UpdateTableDto,
    posId: string
  ): Promise<[RaptorOpenTableResponseInterface, Error, string]> {
    const { remarks, tableId, operator, cover } = orderInfo;
    const dataOpenTable: RaptorOpenTableInterface = {
      token,
      tablename: tableId,
      posid: `pos00${posId}`,
      operator,
      cover,
      orderremark: remarks,
    };
    const [response, error, message] = await raptorApiService.openTable(
      dataOpenTable
    );
    return [response, error, message];
  }

  private async authenWithRaptor(raptorAuthenInfo: RaptorAuthenInterFace) {
    const { username, password } = raptorAuthenInfo;
    const [res, err, _msg] = await raptorApiService.authenticate({
      username,
      password,
    });
    if (err) {
      throw new HttpException(
        this.buildRaptorMessageError(err, ResponseType.Raptor),
        HttpStatus.BAD_REQUEST
      );
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
      };
      const authenRes = await this.authenWithRaptor(dataAuthen);
      const token: string = authenRes?.access_token;
      const dataRequest: RaptorPrintBillInterface = {
        posid: posId as string,
        tablename: tableName as string,
        salesno: salesNo as number,
        splitno: splitNo as number,
        operator: operator as number,
        token,
      };
      const [billData, err, _msg] = await raptorApiService.printBill(
        dataRequest
      );
      if (err) {
        throw new HttpException(
          this.buildRaptorMessageError(err, ResponseType.Raptor),
          HttpStatus.BAD_REQUEST
        );
      }
      return billData;
    }
    return [];
  }

  private buildRaptorMessageError = (error: any, type: ResponseType) => {
    this.logging(error);
    if (!error?.response) {
      return { error, type };
    }
    const { response } = error;
    const objectErr = {
      status: response.status,
      message: error.message,
      type,
    };
    return objectErr;
  };

  private logging(error: any) {
    if (error && error.config && error.response) {
      const { response } = error;
      if (response) {
        const { status, statusText, headers, config, data } = response;
        console.log("config", config);
        const { url, method, data: dataConfig, headers: headerConfig } = config;
        const configErr = {
          url,
          method,
          data: dataConfig,
          headers: headerConfig,
        };
        const dataLogging = {
          status,
          statusText,
          headers,
          config: configErr,
          dataResponse: data,
        };

        console.log("==========ERROR OCCURE FROM POS============\n");
        console.log(dataLogging);
      }
    }
  }

  private validateTableInfo(tableInfo: UpdateTableDto) {
    const { outletId, tableId, cover, operator } = tableInfo;
    if (!outletId) {
      throw new HttpException("outletId can not null.", HttpStatus.BAD_REQUEST);
    }
    if (!tableId) {
      throw new HttpException("tableId can not null.", HttpStatus.BAD_REQUEST);
    }
    if (cover !== 0 && !cover) {
      throw new HttpException("cover can not null.", HttpStatus.BAD_REQUEST);
    }
    if (operator !== 0 && !operator) {
      throw new HttpException("operator can not null.", HttpStatus.BAD_REQUEST);
    }
  }

  private async validateOrderRequest(orderInfo: SubmitOrderDto) {
    const {
      tableName,
      salesNo,
      splitNo,
      items,
      posId,
      operator,
      salesCategory,
      itemQty,
    } = orderInfo;
    if (!salesNo) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "salesNo can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    if (splitNo !== 0 && !splitNo) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "splitNo can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    if (operator !== 0 && !operator) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "operator can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    if (salesCategory !== 0 && !salesCategory) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "salesCategory can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    if (itemQty !== 0 && !itemQty) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "itemQty can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    if (!items || !items?.length) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "items can not empty.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }
    if (!tableName) {
      throw new HttpException(
        this.buildRaptorMessageError(
          "tableName can not null.",
          ResponseType.Middleware
        ),
        HttpStatus.BAD_REQUEST
      );
    }
    const posInfo = await this.posManager.findById(posId);
    if (!posInfo) {
      throw new HttpException(
        this.buildRaptorMessageError("Pos not found.", ResponseType.Middleware),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private validateBillInfo(billDataRequest: ViewBillDataRequest) {
    const { posId, salesNo, splitNo, tableName, operator } = billDataRequest;
    if (!posId) {
      throw new HttpException("posId can not null.", HttpStatus.BAD_REQUEST);
    }
    if (salesNo !== 0 && !salesNo) {
      throw new HttpException("salesNo can not null.", HttpStatus.BAD_REQUEST);
    }
    if (splitNo !== 0 && !splitNo) {
      throw new HttpException("splitNo can not null.", HttpStatus.BAD_REQUEST);
    }
    if (!tableName) {
      throw new HttpException(
        "tableName can not null.",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!operator) {
      throw new HttpException("operator can not null.", HttpStatus.BAD_REQUEST);
    }
  }

  private validateGetInfoPosRequest(request: GetInfoPosDto) {
    const { tableId, outletId } = request;
    if (!tableId) {
      throw new HttpException("tableId can not null.", HttpStatus.BAD_REQUEST);
    }
    if (!outletId) {
      throw new HttpException("outletId can not null.", HttpStatus.BAD_REQUEST);
    }
  }
}
