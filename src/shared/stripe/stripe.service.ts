import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class StripeService {
    constructor(@InjectStripe() private readonly stripeClient: Stripe) { }
    public async createCustomer(customer: Stripe.CustomerCreateParams) {
        try {
            const result = await this.stripeClient.customers.create(customer)
            return result
        } catch (error) {
            throw new HttpException(error.raw.message, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createSubscription(data: Stripe.SubscriptionCreateParams) {
        try {
            return this.stripeClient.subscriptions.create(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createCoupon(data: Stripe.CouponCreateParams) {
        try {
            return this.stripeClient.coupons.create(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
    public async createProduct(data: Stripe.ProductCreateParams) {
        try {
            return this.stripeClient.products.create(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
}
