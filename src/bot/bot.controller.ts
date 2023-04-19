import { Post, Body, Injectable, Controller, Req } from '@nestjs/common';
import { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';
import { InjectBot } from 'nestjs-telegraf/dist/decorators/core/inject-bot.decorator';
import { Telegraf, Context } from 'telegraf';
import { UpdateType } from 'telegraf/typings/telegram-types';

const rubToCents = (rub: number) => rub * 100;

@Injectable()
@Controller('bot')
export class BotController {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  @Post('/createInvoiceLink')
  async create(@Body() { prices }: CreateInvoiceLinkDto) {
    const link = await this.bot.telegram.createInvoiceLink({
      title: 'Заказ',
      description: 'Описание',
      provider_token: process.env.SBERBANK_TEST_TOKEN,
      currency: 'RUB',
      payload: 'test',
      prices: prices.map((price) => ({
        ...price,
        amount: rubToCents(price.amount),
      })),
    });

    return { link };
  }

  @Post('/update')
  async update(@Body() body: UpdateType, @Req() request: Request) {
    console.log('!!!request.headers:', request.headers);
    console.log('!!!body:', body);
  }
}
