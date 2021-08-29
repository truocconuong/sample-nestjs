import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreatePromocodeDto {
    @ApiProperty()
    @IsString()
    name!:string

    @ApiProperty()
    @IsNumber()
    percent!:number


    @ApiProperty()
    @IsString()
    type!:string




}