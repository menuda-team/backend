import { Injectable } from '@nestjs/common';
import { Start, Ctx, Update, Help, On } from 'nestjs-telegraf';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';

const START_MESSAGE = `
Привет!

Это бот для заказа еды из ресторана Любимое кафе.

Чтобы открыть меню, нажми на кнопку ☰ в левом нижнем углу. 

Приятного аппетита 😋
`;

@Injectable()
@Update()
export class BotProvider {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(START_MESSAGE);
  }

  @On('pre_checkout_query')
  async checkout(@Ctx() ctx: Context) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  async onMessage(@Ctx() ctx: Context) {
    console.log('ctx.message!!!:', ctx.message);
  }
}
