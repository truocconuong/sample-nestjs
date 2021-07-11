import { Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { OrdersModel } from "src/entity/orders";
import { UpdateResult } from "typeorm";
import { OrdersService } from "../orders/providers";
import { UserService } from "../user/providers";

@Controller('webhook')
export class WebhookController {
    constructor(private userService: UserService, private orderService: OrdersService) { }

    @Post('create-invoice')
    async createInvoice(@Body() body: any) {
        const user = await this.userService.findOne({ customer_stripe_id: body.customer })
        if (!user) {
            throw new NotFoundException('User not found !');
        }
        const dataOrder = {
            user_id: user.id,
            order_id: body.id || '',
            status: body.status || '',
            paid_date: new Date(body.created * 1000),
            paid: body.paid || '',
            amount: body.total || 0
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
    async paymentIntentCanceled(@Body() _body: any) {

    }
}