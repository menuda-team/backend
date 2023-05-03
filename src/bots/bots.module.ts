import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './bots.schema';
import { Product, ProductSchema } from '../products/product.schema';

@Module({
  controllers: [BotsController],
  providers: [BotsService],
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
})
export class BotsModule {}
