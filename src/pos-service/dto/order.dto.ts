import { IsArray, IsOptional } from "class-validator";

export class SubmitOrderDto {
    // @IsNotEmpty({ message: 'Please select outlet' })
    outletId: string = '';

    // @IsNotEmpty({ message: 'Please select table' })
    tableId: string = '';

    @IsArray()
    // @ArrayNotEmpty({ message: 'items can not empty' })
    items!: [ItemInterface];

    @IsOptional()
    remarks: string = '';
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
