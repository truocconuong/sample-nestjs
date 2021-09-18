import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: 'gmail',
                auth: {
                    user: 'manhchu@fetch.tech',
                    pass: 'Nudaotac1',
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
