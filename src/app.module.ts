import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, ExceptionsFilter } from './common';
import { configuration } from './config';
import { UserModule } from './modules/user/user.module';
import { MasterdataModule } from './modules/masterdata/masterdata.module';
import { ContactModule } from './modules/contact/contact.module';
import { AuthModule } from './modules/auth/auth.module';
import { StripeModule } from 'nestjs-stripe';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SystemParameterModule } from './modules/system_parameter/system_parameter.module';
import { ScheduleModule } from '@nestjs/schedule'
import { SingPassModule } from './modules/singpass/singpass.module';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Database
    // https://docs.nestjs.com/techniques/database
    // app.useGlobalPipes(new ValidationPipe({
    //   transform: true,      
    //   whitelist: true,
    // })),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        entities: [`${__dirname}/entity/**/*.{js,ts}`],
        subscribers: [`${__dirname}/subscriber/**/*.{js,ts}`],
        migrations: [`${__dirname}/migration/**/*.{js,ts}`],
        ...config.get('db'),
      }),
      inject: [ConfigService],
    }),


    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    // Module Router
    // https://github.com/nestjsx/nest-router
    // Service Modules
    CommonModule, // Global
    UserModule,
    MasterdataModule,
    ContactModule,
    AuthModule,
    StripeModule.forRoot({
      apiKey: process.env.SECRET_KEY_STRIPE ? process.env.SECRET_KEY_STRIPE : '',
      apiVersion: '2020-08-27',
    }),
    ScheduleModule.forRoot(),
    TransactionsModule,
    StripeModule,
    SubscriptionsModule,
    WebhookModule,
    OrdersModule,
    SystemParameterModule,
    SingPassModule
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    { provide: APP_FILTER, useClass: ExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  // Global Middleware, Inbound logging
  public configure(_consumer: MiddlewareConsumer): void {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
