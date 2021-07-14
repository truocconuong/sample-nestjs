import { Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { OrdersModel } from "src/entity/orders";
import { UpdateResult } from "typeorm";
import { OrdersService } from "../orders/providers";
import { UserService } from "../user/providers";
import { SubscripionsService } from "../subscriptions/providers";

@Controller('webhook')
export class WebhookController {
    constructor(private userService: UserService, private orderService: OrdersService, private subscriptionService: SubscripionsService) { }

    @Post('create-invoice')
    async createInvoice(@Body() body: any) {
        const user = await this.userService.findOne({ customer_stripe_id: body.customer })
        if (!user) {
            throw new NotFoundException('User not found !');
        }
        const subscription = await this.subscriptionService.findOne({subscription_id: body.subscription})
        const dataOrder = {
            user_id: user.id,
            order_id: body.id || '',
            status: body.status || '',
            paid_date: new Date(body.created * 1000),
            paid: body.paid || '',
            amount: body.total || 0,
            subscription_id: subscription!.id
        }
        const order = await this.orderService.create(dataOrder as OrdersModel)
        return order;
    }

    @Post('update-invoice')
    async updateInvoice(@Body() body: any): Promise<UpdateResult> {
        const order = await this.orderService.findOne({
            order_id: body
        })
        if (!order) {
            throw new NotFoundException('order not found !')
        }
        const dataUpdateOrder = {
            status: body.status,
            paid: body.paid
        }
        const updateOrder = await this.orderService.update(order.id, dataUpdateOrder)
        return updateOrder
    }

    @Post('payment_intent-canceled')
    async paymentIntentCanceled(@Body() body: any) {
        const order = await this.orderService.findOne({
            order_id: body.invoice
        })
        if (!order) {
            throw new NotFoundException('order not found !')
        }
        const dataUpdateOrder = {
            status: body.status,
        }   
        const subscription = await this.subscriptionService.findOne({subscription_id: order.subscription_id})
        const updateSubscription = await this.subscriptionService.update(subscription!.id, dataUpdateOrder)
        const updateOrder = await this.orderService.update(order.id, dataUpdateOrder)
        return [updateOrder,updateSubscription]
    }

    @Post('invoice-voided')
    async invoiceVoided(@Body() body: any){
        const order = await this.orderService.findOne({
            order_id: body.id
        })
        if (!order) {
            throw new NotFoundException('order not found !')
        }
        const dataUpdateOrder = {
            status: body.status,
        }
        const updateOrder = await this.orderService.update(order.id, dataUpdateOrder)
        return updateOrder
    }
}