import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken'

interface IVerify {
  username: string,
  password: string
}

@Injectable()
export class AuthenticateActionGuard implements CanActivate {
  constructor() { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;
      if (!authorization) {
        throw new UnauthorizedException();
      }
      const verifyToken: IVerify = jwt.verify(authorization, process.env.JWT_SECRET as string) as IVerify;
      const { username, password } = verifyToken;
      if (username !== process.env.USERNAME || password !== process.env.PASSWORD) {
        return false
      }
      return true
    } catch (error) {
      throw new UnauthorizedException();
    }

  }
}