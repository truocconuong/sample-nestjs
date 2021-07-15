import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsModel } from 'src/entity/subscriptions';
import { StripeModule } from 'src/shared/stripe/stripe.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionsModel
    ]),
    StripeModule,
    forwardRef(()=>AuthModule),
    forwardRef(()=>UserModule),

  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class SubscriptionsModule { }
