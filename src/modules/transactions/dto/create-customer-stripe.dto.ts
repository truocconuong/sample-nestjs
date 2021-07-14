import { IsEmail, IsObject, IsOptional, IsString, Length } from "class-validator";

class AddressCustomerDto {
    @IsString()
    @Length(1, 255)
    @IsOptional()
    public city!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public country!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public line1!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public line2!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public postal_code!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public state!: string
}

export class CreateCustomerStripe {
    @IsEmail()
    @Length(1, 45)
    @IsOptional()
    public email!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public description!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public name!: string

    @IsString()
    @Length(1, 255)
    @IsOptional()
    public phone!: string

    @IsObject()
    @IsOptional()
    public address!: AddressCustomerDto
}