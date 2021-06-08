import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PosAuthenticateModel } from 'src/entity/pos-authenticate';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticateClientService {
  constructor(
    @InjectRepository(PosAuthenticateModel)
    private table: Repository<PosAuthenticateModel>,
  ) { }
  public async findClientByClientId(client_id: string | undefined): Promise<PosAuthenticateModel | undefined> {
    return this.table.findOne({
      client_id
    });
  }

}
