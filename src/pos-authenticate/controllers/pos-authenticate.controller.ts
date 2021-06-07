import { Body, Controller, Post } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { CreateDto } from '../dto';
import { CrudService } from '../providers';

@Controller('token')
export class CrudController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(private crud: CrudService) { }
  // eslint-disable-next-line @typescript-eslint/require-await
  @Post('generate')
  public async generateToken(@Body() body: CreateDto): Promise<{ token: string; secret_key: string }> {
    const tokenSign = jwt.sign({
      client_id: body.client_id,
    }, body.secret_key);

    await this.crud.create({
      client_id: body.client_id,
      secret_key: body.secret_key,
      token: tokenSign,
    });
    return {
      token: tokenSign,
      secret_key: body.secret_key,
    };
  }
}