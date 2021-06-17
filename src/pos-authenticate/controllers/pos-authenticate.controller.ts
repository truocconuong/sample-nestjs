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
  public async generateToken(@Body() body: CreateDto): Promise<{ signature: string }> {
    const secret: string = `${process.env.JWT_SECRET}`
    const tokenSign = jwt.sign({
      client_id: body.client_id,
    }, secret);

    const signature = tokenSign && tokenSign.length > 1 ? tokenSign.split('.')[2] : '';

    await this.crud.create({
      client_id: body.client_id,
      secret_key: secret,
      token: tokenSign,
      signature
    });
    return {
      signature: signature
    };
  }
}