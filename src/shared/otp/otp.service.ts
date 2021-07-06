import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

authenticator.options = { digits: 4 };


@Injectable()
export class OtpService {
    public generateTokenByEmail(email: string) {
        const token = authenticator.generate(email);
        return { token }
    }

    public checkValidToken(token: string, secret: string) {
        const isValid = authenticator.check(token, secret);
        return isValid
    }
}
