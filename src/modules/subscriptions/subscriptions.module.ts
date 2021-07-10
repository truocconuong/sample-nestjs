import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsModel } from 'src/entity/subscriptions';
import { AuthModule } from '../auth/auth.module';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionsModel
    ]),
    forwardRef(() => AuthModule)
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class SubscriptionsModule { }
