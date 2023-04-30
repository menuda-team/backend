import { Injectable } from '@nestjs/common';
import { Start, Ctx, Update, On } from 'nestjs-telegraf';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';
import { Update as UpdateType } from 'typegram/update';
import { Message } from 'typegram/message';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

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
    private readonly usersService: UsersService,
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
    const { total_amount } = ctx.message.successful_payment;
    const { items } = await this.usersService.getCart(userId);

    await this.ordersService.create({
      items,
      totalAmount: total_amount,
      user: userId,
    });
  }
}
