import { Controller, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateInvoiceLinkDto } from './dto/create-invoice-link.dto';

@ApiTags('Bot')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('/createInvoiceLink')
  async create(@Body() dto: CreateInvoiceLinkDto) {
    return this.botService.createInvoiceLink(dto);
  }
}
