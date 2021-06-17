import { Body, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { AuthenticateActionGuard } from 'src/auth/guards/authenticate-action.guard';

import { CreateDto } from '../dto';
import { LoginDto } from '../dto/login.dto';
import { CrudService } from '../providers';

@Controller()
export class CrudController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(private crud: CrudService) { }
  // eslint-disable-next-line @typescript-eslint/require-await

  @UseGuards(AuthenticateActionGuard)
  @Post('generate/token')
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

  @Post('auth/login')
  public async login(@Body() body: LoginDto) {
    const { username, password } = body;
    if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
      throw new UnauthorizedException();
    }
    const tokenSign = jwt.sign({
      username,
      password
    }, process.env.JWT_SECRET as string ,{
      expiresIn: '24h'
    });

    return {
      token: tokenSign
    }
  }
}