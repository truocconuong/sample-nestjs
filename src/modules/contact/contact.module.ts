import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModel } from 'src/entity/contact';
import * as controllers from './controllers';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactModel
    ]),
  ],
  controllers: Object.values(controllers),
  providers: [...Object.values(providers)],
  exports: [...Object.values(providers)]
})
export class ContactModule { }
