import { Module } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { BotController } from './bot.controller';

@Module({
  providers: [BotProvider],
  controllers: [BotController],
})
export class BotModule {}
