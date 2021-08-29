import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class SignInDto {
    @ApiProperty()
    @IsEmail()
    @Length(1, 45)
    email!: string;

    @ApiProperty()
    @IsString()
    password!: string;
}