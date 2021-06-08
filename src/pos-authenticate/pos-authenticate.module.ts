import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PosAuthenticateModel } from '../entity/pos-authenticate';
import * as controllers from './controllers';
import * as providers from './providers';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ...Object.values(tables)
      PosAuthenticateModel,
    ]),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class PocAuthenticateModule { }
