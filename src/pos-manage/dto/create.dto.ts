import { IsString } from 'class-validator';

import { PocManageModel } from '../../entity/pos-manage';

export class CreateDto implements Omit<PocManageModel, 'id' | 'updated_at' | 'created_at'> {
  @IsString()
  public order_id!: string;

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
}
