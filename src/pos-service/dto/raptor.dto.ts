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
export interface RaptorOpenTableInterface extends RaptorCommonRequestInterface {
    cover: number;
    orderremark: string;
    tablename: string;
}

export interface RaptorRecallTableInterface extends RaptorTableDetailInterface, RaptorCommonRequestInterface {
}
export interface RaptorOrderItemInterface extends RaptorCommonRequestInterface, RaptorTableDetailInterface {
    item_qty: number;
    sales_category: number;
    pluno?: string;
}

export interface RaptorPrepItemInterface extends RaptorCommonRequestInterface, RaptorTableDetailInterface {
    item_qty: number;
    sales_category: number;
    pluSalesRef: number;
    pluno?: string;
}

export interface RaptorModifyItemInterface extends RaptorCommonRequestInterface, RaptorTableDetailInterface {
    item_qty: number;
    sales_category: number;
    pluSalesRef: number;
    pluno?: string;
}

export interface RaptorPrintBillInterface extends RaptorCommonRequestInterface, RaptorTableDetailInterface {
}
/*============RESPONSE==============*/
export interface RaptorOpenTableResponseInterface extends RaptorBaseResponseInterface {
    salesno: number;
    splitno: number;
}

export interface RaptorRecallTableResponseInterface extends RaptorBaseResponseInterface {
    salesno: number;
    splitno: number;
}

export interface RaptorListTableOpenInterface extends RaptorBaseResponseInterface {
    details: RaptorTableDetailInterface[];
}

export interface RaptorOrderItemResponseInterface extends RaptorBaseResponseInterface {
    salesno: number;
    splitno: number;
    pluSalesRef: number;
}

export interface RaptorPrepItemResponseInterface extends RaptorBaseResponseInterface {
    salesno: number;
    splitno: number;
}

export interface RaptorModifyItemResponseInterface extends RaptorBaseResponseInterface {
    salesno: number;
    splitno: number;
    pluSalesRef: number;
}


export interface RaptorBillResponseInterface extends RaptorBaseResponseInterface, RaptorTableDetailInterface {
    pluSalesRef: number;
    header1: string;
    header2: string;
    header3: string;
    header4: string;
    header5: string;
    header6: string;
    footer1: string;
    footer2: string;
    footer3: string;
    footer4: string;
    footer5: string;
    footer6: string;
    footer7: string;
    footer8: string;
    footer9: string;
    footer10: string;
    footer11: string;
    footer12: string;
    number: string;
    opendate: string;
    opentime: string;
    cover: number;
    tax: TaxResponseInterface[];
    postitle: string;
    opName: string;
    sTotal: number;
    balance: number;
    details: BillDetailResponseInterface[];
}

export interface TaxResponseInterface {
    name: string;
    amount: number;
}
export interface BillDetailResponseInterface {
    qty: number;
    name1: string;
    name2: string;
    amount: number,
    transtypeID: number,
    transtype: string;
}

export interface SubmitOrderResponseInterface {
    success: boolean;
    data: SubmitOrderDataInterface;
}

export interface UpdateTableResponseInterface {
    success: boolean;
    data: UpdateOrderDataInterface;
}

export interface SubmitOrderDataInterface {
    posId?: string;
    operator?: number;
    salesNo?: number;
    splitNo?: number;
    tableName?: string;
}

export interface UpdateOrderDataInterface extends SubmitOrderDataInterface {

}
export interface ViewBillDataRequest extends SubmitOrderDataInterface {
}
