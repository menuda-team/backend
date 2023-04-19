import { Injectable } from '@nestjs/common';
import { Start, Ctx, Update, Help } from 'nestjs-telegraf';
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
  @Help()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(START_MESSAGE);
  }
}
