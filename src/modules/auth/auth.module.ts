import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModel } from 'src/entity/contact';
import { OtpModule } from 'src/shared/otp/otp.module';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import { AuthService } from './providers';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module'; 
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactModel,
    ]),
    forwardRef(() => SubscriptionsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => UserModule),

    OtpModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy ,JwtStrategy],
  controllers: Object.values(controllers),
  exports: [PassportModule,AuthService]
})
export class AuthModule { }
