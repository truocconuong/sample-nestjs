import { IsEmail, IsString, Length } from "class-validator";


export class CreateContactDto {
  @IsString()
  @Length(1, 45)
  first_name?: string;

  @IsString()
  @Length(1, 45)
  last_name?: string;

  @IsEmail()
  @Length(1, 99)
  email?: string;

  @IsString()
  @Length(1, 255)
  reason?: string;

  @IsString()
  @Length(1, 255)
  message?: string;
}
