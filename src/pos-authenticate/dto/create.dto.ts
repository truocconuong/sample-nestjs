import { IsString } from 'class-validator';
import { PosAuthenticateModel } from 'src/entity/pos-authenticate';

export class CreateDto implements Omit<PosAuthenticateModel, 'id' | 'updated_at' | 'created_at'> {
  @IsString()
  public client_id!: string;
  
  public secret_key!: string;

}
