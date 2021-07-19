import { HttpException, HttpStatus, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { SystemParameterService } from '../../modules/system_parameter/providers'
import { STRIPE_TYPE } from 'src/common/constants/index'
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StripeService implements OnModuleInit {
    private stripe: any;
    constructor(private systemParameterService: SystemParameterService) { 
    }

    async onModuleInit() {
        const systemParemeter = await this.systemParameterService.findOne({type: STRIPE_TYPE})
        const stripeKey = systemParemeter!.value ? systemParemeter!.value : ''
        if(stripeKey === ''){
            throw new NotFoundException('Stripe Key not found !')
        }
        else{
            this.stripe = new Stripe(stripeKey, {
                apiVersion: '2020-08-27',
            });
        }
        
    }

    @Cron('1 * * * *')
    async handleCron() {
        const currentStripeKey = this.stripe._api.auth.slice(7)
        const systemParemeter = await this.systemParameterService.findOne({type: STRIPE_TYPE})
        const stripeKey = systemParemeter!.value 
        if(!stripeKey){
            return
        }
        if(currentStripeKey !== stripeKey ){
        const stripe = new Stripe(stripeKey, {
            apiVersion: '2020-08-27',
          });
        this.stripe = stripe
        }
    }

    public async createCustomer(customer: Stripe.CustomerCreateParams) {
        try {
            const result = await this.stripe.customers.create(customer)
            return result
        } catch (error) {
            throw new HttpException(error.raw.message, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createSubscription(data: Stripe.SubscriptionCreateParams) {
        try {
            return this.stripe.subscriptions.create(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createCoupon(data: Stripe.CouponCreateParams) {
        try {
            return this.stripe.coupons.create(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createProduct(data: Stripe.ProductCreateParams) {
        try {
            return this.stripe.products.create(data) 
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
}
