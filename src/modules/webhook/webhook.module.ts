import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { UserModule } from '../user/user.module';
import { WebhookController } from './webhook.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    imports: [
        OrdersModule,
        UserModule,
        SubscriptionsModule
    ],
    controllers: [WebhookController],
})
export class WebhookModule { }