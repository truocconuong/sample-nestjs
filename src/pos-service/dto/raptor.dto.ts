export interface RaptorAuthenInterFace {
    username: string;
    password: string;
}

export interface TabbleOpenListInterface {
    token: string;
}

export interface RaptorListTableOpenInterface {
    errorCode: number;
    msg: string;
    details: RaptorTableDetailInterface[];
}

export interface RaptorTableDetailInterface {
    salesno: number;
    splitno: number;
    tablename: string;
}


export interface RaptorOpenTableInterface {
    token: string;
    tablename: string;
    posid: string;
    operator: number;
    cover: number;
    orderremark: string;
}

export interface RaptorRecallTableInterface extends RaptorTableDetailInterface {
    token: string;
    posid: string;
    operator: number;
}