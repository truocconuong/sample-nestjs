import { IsOptional, IsString } from "class-validator";

export class QueryMasterData {
    @IsString()
    @IsOptional()
    value?: string
}