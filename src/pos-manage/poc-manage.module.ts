import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PocManageModel } from '../entity/pos-manage';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ...Object.values(tables)
      PocManageModel,
    ]),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
})
export class PocManageModule {}
