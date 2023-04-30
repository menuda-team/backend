import { Injectable } from '@nestjs/common';
import { Start, Ctx, Update, Help, On } from 'nestjs-telegraf';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';
import { Update as UpdateType } from 'typegram/update';
import { Message } from 'typegram/message';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderItem } from '../orders/order.schema';

const START_MESSAGE = `
Привет!

Это бот для заказа еды из ресторана Любимое кафе.

Чтобы открыть меню, нажми на кнопку ☰ в левом нижнем углу. 

Приятного аппетита 😋
`;

@Injectable()
@Update()
export class BotProvider {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private readonly ordersService: OrdersService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(START_MESSAGE);
  }

  @On('pre_checkout_query')
  async checkout(@Ctx() ctx: Context) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  async onMessage(
    @Ctx()
    ctx: Context<UpdateType.MessageUpdate<Message.SuccessfulPaymentMessage>>,
  ) {
    const { id: userId } = ctx.message.from;
    const { invoice_payload, total_amount } = ctx.message.successful_payment;
    const { items } = JSON.parse(invoice_payload) as { items: OrderItem[] };

    await this.ordersService.create({
      items,
      totalAmount: total_amount,
      user: userId,
    });
  }
}
