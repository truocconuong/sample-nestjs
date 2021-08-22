import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodesModel } from 'src/entity/promocodes';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromocodesModel
    ]),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class PromocodesModule { }
