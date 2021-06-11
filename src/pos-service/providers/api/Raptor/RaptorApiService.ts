import Request from '../request';
import apiUrls from '../config';
import { RaptorAuthenInterFace, RaptorBillResponseInterface, RaptorListTableOpenInterface, RaptorModifyItemInterface, RaptorModifyItemResponseInterface, RaptorOpenTableInterface, RaptorOpenTableResponseInterface, RaptorOrderItemInterface, RaptorOrderItemResponseInterface, RaptorPrepItemInterface, RaptorPrepItemResponseInterface, RaptorPrintBillInterface, RaptorRecallTableInterface, RaptorRecallTableResponseInterface } from 'src/pos-service/dto/raptor.dto';
import Querystring from 'querystring';
import { ParsedUrlQueryInput } from 'querystring';

export const baseURLRaptor = process.env.RAPTOR_API_URL;

export const raptorApiService = {
  authenticate: async function (data: RaptorAuthenInterFace) {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.authen(process.env.RAPTOR_API_URL as string), Querystring.stringify(data as unknown as ParsedUrlQueryInput));
    return [dataResponse, err, msg];
  },
  openTable: async function (data: RaptorOpenTableInterface): Promise<[RaptorOpenTableResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.openTable(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  recallTable: async function (data: RaptorRecallTableInterface): Promise<[RaptorRecallTableResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.recallTable(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  orderItem: async function (data: RaptorOrderItemInterface): Promise<[RaptorOrderItemResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.orderItem(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  prepItem: async function (data: RaptorPrepItemInterface): Promise<[RaptorPrepItemResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.prepItem(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  modifyItem: async function (data: RaptorModifyItemInterface): Promise<[RaptorModifyItemResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.orderModifier(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  printBill: async function (data: RaptorPrintBillInterface): Promise<[RaptorBillResponseInterface, Error, string]> {
    const [dataResponse, err, msg] = await Request.post(apiUrls.raptor.printBill(process.env.RAPTOR_API_URL as string), data, {}, data.token);
    return [dataResponse, err, msg];
  },
  getListTableOpen: async function (token: string): Promise<[RaptorListTableOpenInterface, Error, string]> {
    console.log("token nhan dc la: ", token)
    const [dataResponse, err, msg] = await Request.get(apiUrls.raptor.getOpenTableList(process.env.RAPTOR_API_URL as string), {}, token);
    return [dataResponse as RaptorListTableOpenInterface, err as Error, msg as string];
  },
};
