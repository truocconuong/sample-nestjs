import { IsEmail, IsString, Length } from "class-validator";

export class VerifyOtpUserUpdateDto {
    @IsEmail()
    @Length(1, 45)
    email!: string;

    @IsString()
    @Length(1, 4)
    otp!: string;
}