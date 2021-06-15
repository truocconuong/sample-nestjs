import { IsArray } from "class-validator";

export class UpdateTableDto {
    outletId: string = "";

    tableId: string = "";

    remarks: string = "";

    operator!: number;

    cover!: number;
}

export class GetInfoPosDto {
    outletId: string = "";

    tableId: string = "";
}

export class SubmitOrderDto {
    tableName!: string;

    posId!: string;

    operator!: number;

    salesNo!: number;

    splitNo!: number;

    salesCategory!: number;

    itemQty!: number;

    @IsArray()
    items!: [ItemInterface];

    instruction!: string;
}
export class ViewBillOrderDto {
    posId!: string;
    operator!: number;
    salesNo!: number;
    splitNo!: number;
    tableName!: string;
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
