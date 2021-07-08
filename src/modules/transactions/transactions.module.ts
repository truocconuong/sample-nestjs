import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import * as providers from './providers';


@Module({
    imports: [
        AuthModule,
        UserModule
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(providers)],
    exports: [...Object.values(providers)]
})
export class TransactionsModule { }