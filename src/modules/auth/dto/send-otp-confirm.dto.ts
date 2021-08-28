import { IsEmail, Length } from "class-validator";

export class SendOtpConfirmDto {
    @IsEmail()
    @Length(1, 45)
    email!: string;
}