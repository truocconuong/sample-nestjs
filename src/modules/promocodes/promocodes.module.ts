import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodesModel } from 'src/entity/promocodes';
import { StripeModule } from 'src/shared/stripe/stripe.module';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromocodesModel,
    ]),
    UserModule,
    StripeModule
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class PromocodesModule { }
