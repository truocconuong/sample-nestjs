import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class TransactionsService {
    constructor(@InjectStripe() private readonly stripeClient: Stripe) { }
    public async createCustomer(customer: Stripe.CustomerCreateParams) {
        return this.stripeClient.customers.create(customer)
    }
    public async createInvoice (){

    }
}
