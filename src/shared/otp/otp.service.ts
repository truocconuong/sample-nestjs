import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

authenticator.options = { digits: 4, step: 120 };



@Injectable()
export class OtpService {
    public generateTokenByEmail(email: string) {
        const token = authenticator.generate(email);
        console.log('generate token',{email, token})
        return { token }
    }

    public checkValidToken(token: string, secret: string) {
        console.log('check valid',{token, secret})
        const isValid = authenticator.verify({ token, secret });
        console.log(isValid)
        return isValid
    }
}
