import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticateClientService } from '../../pos-authenticate/providers/authenticate-client.service'

@Injectable()
export class AuthenticateClientGuard implements CanActivate {
  constructor(private authClientService: AuthenticateClientService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { signature } = request.headers;
    if (!signature) {
      throw new UnauthorizedException();
    }
    const checkSignature = await this.authClientService.findClientBySignature(signature);
    if (!checkSignature) {
      throw new UnauthorizedException();
    }
    return true

  }
}