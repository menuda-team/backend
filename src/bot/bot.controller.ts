import { Post, Body, Injectable, Controller, Req, Param } from '@nestjs/common';
import { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';
import type { Request } from 'express';
import type { Update } from 'typegram/update';

const rubToCents = (rub: number) => rub * 100;

@Injectable()
@Controller('bot')
export class BotController {
  // constructor(@InjectBot() private bot: Telegraf<Context>) {}

  // @Post('/createInvoiceLink')
  // async create(@Body() { prices }: CreateInvoiceLinkDto) {
  //   const link = await this.bot.telegram.createInvoiceLink({
  //     title: 'Заказ',
  //     description: 'Описание',
  //     provider_token: process.env.SBERBANK_TEST_TOKEN,
  //     currency: 'RUB',
  //     payload: 'wtf',
  //     prices: prices.map(({ label, amount }) => ({
  //       label,
  //       amount: rubToCents(amount),
  //     })),
  //     need_name: true,
  //     need_phone_number: true,
  //     need_shipping_address: true,
  //   });
  //
  //   return { link };
  // }

  @Post('/update/:token')
  async update(
    @Body() update: Update,
    @Req() request: Request,
    @Param('token') token: string,
  ) {
    console.log('!!!update->token:', token);
    console.log('!!!update->update:', update);
    if (
      request.headers['x-telegram-bot-api-secret-token'] ===
      process.env.WEBHOOK_SECRET_TOKEN
    ) {
      const bot = new Telegraf(token);
      bot.start((ctx) => ctx.reply('Hello'));

      await bot.handleUpdate(update);
    }
  }
}
