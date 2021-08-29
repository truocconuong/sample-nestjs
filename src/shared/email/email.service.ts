import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
   constructor(private mailerService: MailerService){}
   async sendEmailOtp(email:string,otp:string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Iwill verify the account by otp !',
      html  : `<p>Thank you for using our service, your otp code to verify is <strong>${otp}</strong></p>`
    });
  }
}
