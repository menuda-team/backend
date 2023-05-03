import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { Update } from 'typegram/update';
import { Request } from 'express';
import { Telegraf } from 'telegraf';
import { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';
import { createBot } from './bots.factory';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';

const rubToCents = (rub: number) => rub * 100;

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsService: BotsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('/create')
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto);
  }

  @Get()
  findAll() {
    return this.botsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.botsService.findById(id);
  }

  @Get(':categoryId/products')
  getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Req() request: Request,
  ) {
    const botId = request.headers['bot-id'];

    return this.botsService.getProductsByCategory(
      categoryId,
      Array.isArray(botId) ? botId[0] : botId,
    );
  }

  @Get('/categories/list')
  getCategoriesList(@Req() request: Request) {
    const botId = request.headers['bot-id'];

    return this.botsService.getCategoriesList(
      Array.isArray(botId) ? botId[0] : botId,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botsService.update(+id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botsService.remove(id);
  }

  @Post('/update/:token')
  async webhookUpdate(
    @Body() update: Update,
    @Req() request: Request,
    @Param('token') token: string,
  ) {
    console.log('!!!webhookUpdate->token:', token);
    console.log('!!!webhookUpdate->update:', update);
    if (
      request.headers['x-telegram-bot-api-secret-token'] ===
      process.env.WEBHOOK_SECRET_TOKEN
    ) {
      const bot = createBot({
        token,
        usersService: this.usersService,
        botsService: this.botsService,
        ordersService: this.ordersService,
      });

      await bot.handleUpdate(update);
    }
  }

  @Post('/createInvoiceLink')
  async createInvoiceLink(@Body() { prices, botId }: CreateInvoiceLinkDto) {
    const { token } = await this.botsService.findById(botId);

    const bot = new Telegraf(token);

    const link = await bot.telegram.createInvoiceLink({
      title: 'Заказ',
      description: 'Описание',
      provider_token: process.env.SBERBANK_TEST_TOKEN,
      currency: 'RUB',
      payload: 'wtf',
      prices: prices.map(({ label, amount }) => ({
        label,
        amount: rubToCents(amount),
      })),
      need_name: true,
      need_phone_number: true,
      need_shipping_address: true,
    });

    return { link };
  }
}
