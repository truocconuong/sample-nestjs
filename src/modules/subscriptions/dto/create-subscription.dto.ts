import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionDto {
    @IsObject()
    token!: any

    @IsString()
    @IsOptional()
    promocode?: string

    @IsString()
    cardName?: string

    @IsString()
    postalCode?: string
}