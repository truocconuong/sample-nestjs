import { IsOptional, IsString, Length,IsBoolean } from "class-validator";

export class UpdateSystemParameterDto {

    @IsString()
    @IsOptional()
    @Length(1, 45)
    public type!: string;

    @IsString()
    @IsOptional()
    @Length(1, 45)
    public value!: string;

    @IsBoolean()
    @IsOptional()
    public is_delete!: boolean;


}