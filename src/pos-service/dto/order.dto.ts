import { IsArray } from "class-validator";

export class UpdateTableDto {
    outletId: string = '';

    tableId: string = '';

    remarks: string = ''
}

export class SubmitOrderDto {
    tableName!: string;

    posId!: string;

    operator!: number;

    salesNo!: number;

    splitNo!: number;


    @IsArray()
    items!: [ItemInterface];
}


export class ViewBillOrderDto {
    posId!: string;
    operator!: number;
    salesNo!: number;
    splitNo!: number;
    tableName!: string
}

export interface ItemSelectedOptionsInterface {
    id: string;
    level: string;
    modifierGroupId: string;
    price: number;
}

export interface ItemInterface {
    id: string;
    numOfItem: string;
    remarks?: string;
    categoryId?: string;
    selectedOptions?: ItemSelectedOptionsInterface[];
}
