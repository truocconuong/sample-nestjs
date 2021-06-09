export interface RaptorAuthenInterFace {
    username: string;
    password: string;
}

export interface TabbleOpenListInterface {
    token: string;
}

export interface RaptorBaseResponseInterface {
    errorCode: number;
    msg: string;
}

export interface RaptorTableDetailInterface {
    salesno: number;
    splitno: number;
    tablename: string;
}

export interface RaptorCommonRequestInterface {
    token: string;
    posid: string;
    operator: number; 
}
export interface RaptorOpenTableInterface extends RaptorCommonRequestInterface{
    cover: number;
    orderremark: string;
    tablename: string;
}

export interface RaptorRecallTableInterface extends RaptorTableDetailInterface, RaptorCommonRequestInterface {
}
export interface RaptorOrderItemInterface extends RaptorCommonRequestInterface, RaptorTableDetailInterface{
    item_qty: number;
    sales_category: number;
}
/*============RESPONSE==============*/
export interface RaptorOpenTableResponseInterface extends RaptorBaseResponseInterface{
    salesno: number;
    splitno: number;
}

export interface RaptorRecallTableResponseInterface extends RaptorBaseResponseInterface{
    salesno: number;
    splitno: number;
}

export interface RaptorListTableOpenInterface extends RaptorBaseResponseInterface{
    details: RaptorTableDetailInterface[];
}

export interface RaptorOrderItemResponseInterface extends RaptorBaseResponseInterface{
    salesno: number;
    splitno: number;
    pluSalesRef: number;
}