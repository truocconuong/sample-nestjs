import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModel } from 'src/entity/orders';
import * as controllers from './controllers';
import * as providers from './providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersModel
    ]),
    forwardRef(()=>UserModule),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class OrdersModule { }
