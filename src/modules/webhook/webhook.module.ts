import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { UserModule } from '../user/user.module';
import { WebhookController } from './webhook.controller';


@Module({
    imports: [
        OrdersModule,
        UserModule
    ],
    controllers: [WebhookController],
})
export class WebhookModule { }