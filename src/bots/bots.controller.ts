import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
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
import { CartsService } from '../carts/carts.service';

const rubToCents = (rub: number) => rub * 100;

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsService: BotsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly cartsService: CartsService,
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
    @Query('botId') botId?: string,
  ) {
    return this.botsService.getProductsByCategory(categoryId, botId);
  }

  @Get('/categories/list')
  getCategoriesList(@Query('botId') botId?: string) {
    return this.botsService.getCategoriesList(botId);
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
    @Query('id') id: string,
  ) {
    if (
      request.headers['x-telegram-bot-api-secret-token'] ===
      process.env.WEBHOOK_SECRET_TOKEN
    ) {
      const bot = await createBot({
        token,
        usersService: this.usersService,
        botsService: this.botsService,
        ordersService: this.ordersService,
        cartsService: this.cartsService,
        botId: id,
      });

      await bot.handleUpdate(update);
    }
  }

  @Post('/createInvoiceLink')
  async createInvoiceLink(
    @Body() { prices }: CreateInvoiceLinkDto,
    @Query('botId') botId?: string,
  ) {
    const { token } = await this.botsService.findById(botId);

    const bot = new Telegraf(token);

    const link = await bot.telegram.createInvoiceLink({
      title: 'Заказ бургеров',
      description: 'Приложение работает в тестовом режиме',
      provider_token: process.env.SBERBANK_TEST_TOKEN,
      currency: 'RUB',
      payload: 'no',
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
