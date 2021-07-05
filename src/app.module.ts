import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BaseModule } from './base';
import { CommonModule, ExceptionsFilter, LoggerMiddleware } from './common';
import { configuration } from './config';
import { UserModule } from './modules/user/user.module';
import { MasterdataModule } from './modules/masterdata/masterdata.module';
import { ContactModule } from './modules/contact/contact.module';

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
    BaseModule,
    UserModule,
    MasterdataModule,
    ContactModule
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
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
