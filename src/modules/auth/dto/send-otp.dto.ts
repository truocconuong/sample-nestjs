import { IsEmail, Length } from "class-validator";

export class SendOtpDto {
    @IsEmail()
    @Length(1, 45)
    email!: string;
}