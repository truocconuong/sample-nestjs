import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { AuthenticateClientService } from '../../pos-authenticate/providers/authenticate-client.service'

interface IVerifyAuthenticateClient {
  client_id?: string,
  iat?: number;
}

@Injectable()
export class AuthenticateClientGuard implements CanActivate {
  constructor(private authClientService: AuthenticateClientService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, pass_secret } = request.headers;
    if (!authorization || !pass_secret) {
      throw new UnauthorizedException();
    }
    const verifyToken = jwt.verify(authorization, `${pass_secret}${process.env.SALT}`);
    const client_id = (verifyToken as IVerifyAuthenticateClient).client_id;
    const getAuthenByClientId = await this.authClientService.findClientByClientId(client_id)
    if (!getAuthenByClientId) {
      throw new UnauthorizedException();
    }
    return true
  }
}