import { Post, Body, Injectable, Controller, Req } from '@nestjs/common';
import { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';
import type { Request } from 'express';
import type { Update } from 'typegram/update';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrderItem } from '../orders/order.schema';

const rubToCents = (rub: number) => rub * 100;

@Injectable()
@Controller('bot')
export class BotController {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  @Post('/createInvoiceLink')
  async create(@Body() { items }: CreateInvoiceLinkDto) {
    const order: { items: OrderItem[] } = {
      items: items.map(({ product, ...rest }) => ({
        ...rest,
        product: product._id,
      })),
    };

    const link = await this.bot.telegram.createInvoiceLink({
      title: 'Заказ',
      description: 'Описание',
      provider_token: process.env.SBERBANK_TEST_TOKEN,
      currency: 'RUB',
      payload: JSON.stringify(order),
      prices: items.map((item) => ({
        label: item.product.name,
        amount: rubToCents(item.product.price * item.count),
      })),
      need_name: true,
      need_phone_number: true,
      need_shipping_address: true,
    });

    return { link };
  }

  @Post('/update')
  async update(@Body() update: Update, @Req() request: Request) {
    if (
      request.headers['x-telegram-bot-api-secret-token'] ===
      process.env.WEBHOOK_SECRET_TOKEN
    ) {
      await this.bot.handleUpdate(update);
    }
  }
}
