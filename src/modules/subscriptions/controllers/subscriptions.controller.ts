import { Body, Controller, NotFoundException, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import _ from 'lodash'
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { UserModel } from 'src/entity/user';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorators';
import { UserService } from 'src/modules/user/providers';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscripionsService } from '../providers';
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private stripeService: StripeService, private subscriptionsService: SubscripionsService, private userService: UserService) { }
    @Post()
    @UseInterceptors(TransformInterceptor)
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async createSubscription(@Body() body: CreateSubscriptionDto, @GetUser() user: UserModel): Promise<Boolean> {
        const { token } = body;
        const userDetail = await this.userService.findById(user.id);
        if (!userDetail) {
            throw new NotFoundException('User not found !')
        }
        const { email, phone, full_legal_name, id, customer_stripe_id } = userDetail
        let customerStripeId = customer_stripe_id
        if (!customerStripeId) {
            const customerStripe = await this.stripeService.createCustomer({
                email, phone, name: full_legal_name, source: token.id
            })
            customerStripeId = customerStripe.id
        }
        const createSubStripe = await this.stripeService.createSubscription({
            customer: customerStripeId,
            items: [
                {
                    price: process.env.PRODUCT_MAIN_ID,
                    quantity: 1
                }
            ]
        })
        const dataSub = {
            user_id: id,
            subscription_id: createSubStripe.id,
            status: createSubStripe.status,
            next_invoice: new Date(createSubStripe.current_period_end * 1000)
        }
        await this.userService.update(userDetail.id, {
            customer_stripe_id: customerStripeId
        })
        await this.subscriptionsService.create(dataSub)
        return createSubStripe
    }
}
