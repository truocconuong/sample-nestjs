import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/entity/user';


@Injectable()
export class AuthService {
    constructor(private jwt: JwtService) { }
    public signJwt(user: UserModel): { access_token: string } {
        const payload = { email: user.email, otp: user.otp, id: user.id };
        return {
            access_token: `Bearer ${this.jwt.sign(payload)}`,
        };
    }
}
