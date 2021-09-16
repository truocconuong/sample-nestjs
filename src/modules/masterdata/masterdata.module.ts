import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataModel } from 'src/entity/master_data';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterDataModel,
    ]),
    forwardRef(() => UserModule)
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class MasterdataModule { }