import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class SubmitOrderDto {
    @IsNotEmpty({message: 'Please select outlet'})
    outletId!: string;
  
    @IsNotEmpty({message: 'Please select table'})
    tableId!: string;
  
    @IsArray()
    items!: [ItemInterface];
  
    @IsOptional()
    anonymousId!: string;
  
    @IsOptional()
    remarks!: string;
}

export class ViewBillOrderDto {
    
}

interface ItemSelectedOptionsInterface {
    id: string;
    level: string;
    modifierGroupId: string;
}

interface ItemInterface {
    id: string;
    numOfItem: string;
    remarks?: string;
    categoryId?: string;
    selectedOptions?: ItemSelectedOptionsInterface[];
}
  