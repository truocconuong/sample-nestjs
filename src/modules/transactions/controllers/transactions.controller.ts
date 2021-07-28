import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorators';
import { UserService } from 'src/modules/user/providers';
import { TransactionsService } from '../providers';
@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService, private userService: UserService) { }

    @Post('order')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    public async createOrder(@Body() _body: any, @GetUser() user: UserModel): Promise<boolean> {
        const userDetail = await this.userService.findById(user.id);
        let customerStripeId = userDetail?.customer_stripe_id
        if (!customerStripeId) {
            const customer = {
                email : userDetail?.email,
                name: userDetail?.full_legal_name,
                phone: userDetail?.phone,
                line1 : userDetail?.address_line_1,
                line2 : userDetail?.address_line_2,
                postal_code : userDetail?.postal_code,
            }
            const customerCreated = await this.transactionsService.createCustomer(customer)
            await this.userService.update(userDetail!.id,{customer_stripe_id : customerCreated.id})
            

        }
        return true
    }

}