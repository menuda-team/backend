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

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post('/create')
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto);
  }

  @Get()
  findAll() {
    return this.botsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(+id);
  }

  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.botsService.getProducts(id);
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
      const bot = new Telegraf(token);
      bot.start((ctx) => ctx.reply('Hello'));

      await bot.handleUpdate(update);
    }
  }
}
