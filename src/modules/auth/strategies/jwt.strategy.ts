import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/providers';
export interface JwtPayload { id: string; }


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    });
  }
  
  async validate(req: any, user: any) {
    // validator all
    const jwt = req.headers.authorization
    const isValidBlackList = await this.userService.validateToken(jwt);
    if(!isValidBlackList){
      throw new UnauthorizedException("token expired");
    }
    return user
  }
}
