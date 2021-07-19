import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemParameterModel } from 'src/entity/system-parameter';
import * as controllers from './controllers';
import * as providers from './providers';
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemParameterModel,
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class SystemParameterModule { }