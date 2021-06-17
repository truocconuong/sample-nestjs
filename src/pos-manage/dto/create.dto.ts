import { IsBoolean, IsString } from 'class-validator';

import { PocManageModel } from '../../entity/pos-manage';

export class CreateDto implements Omit<PocManageModel, 'id' | 'updated_at' | 'created_at'> {
  @IsString()
  public outlet_id!: string;

  @IsString()
  public pos_id!: string;

  @IsString()
  public username!: string;

  @IsString()
  public password!: string;

  @IsString()
  public client_id!: string;

  @IsString()
  public client_secret!: string;
  
  @IsBoolean()
  public is_auto!: boolean;
}
