import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SystemParameterModule } from 'src/modules/system_parameter/system_parameter.module'

@Module({
    imports: [SystemParameterModule],
    providers: [StripeService],
    exports: [StripeService],
})
export class StripeModule { }
