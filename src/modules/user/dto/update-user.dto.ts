import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @Length(1, 255)
    @IsOptional()
    public full_legal_name!: string;

    @IsString()
    @IsOptional()
    @Length(1, 255)
    public nric!: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    public will_pdf_link!: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    public pdf_upload_url?: string;

    @IsOptional()
    @IsString()
    @Length(1, 255)
    public will_registry?: string;

    @IsOptional()
    @IsString()
    @Length(1, 45)
    public phone!: string;



}