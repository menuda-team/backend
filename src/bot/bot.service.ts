import { Injectable } from '@nestjs/common';
import type { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';
import bot from './index';

const rubToCents = (rub: number) => rub * 100;

@Injectable()
export class BotService {
  async createInvoiceLink({ prices }: CreateInvoiceLinkDto): Promise<string> {
    return await bot.telegram.createInvoiceLink({
      title: 'Заказ',
      description: 'Описание',
      provider_token: process.env.YO_KASSA_TEST_TOKEN,
      currency: 'RUB',
      payload: 'test',
      prices: prices.map((price) => ({
        ...price,
        amount: rubToCents(price.amount),
      })),
    });
  }
}
