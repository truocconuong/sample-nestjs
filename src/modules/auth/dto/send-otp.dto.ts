import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length, IsEnum, IsOptional } from "class-validator";
export enum ActionTypeSendOtp {
    SIGNUP = 'SIGNUP',
    SIGNIN = 'SIGNIN'
}
export class SendOtpDto {
    @IsEmail()
    @Length(1, 45)
    email!: string;

    @ApiProperty({ enum: ActionTypeSendOtp, required: false })
    @IsOptional()
    @IsEnum(ActionTypeSendOtp)
    type?: ActionTypeSendOtp;
}