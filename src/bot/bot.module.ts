import { Module } from '@nestjs/common';
import { BotProvider } from './bot.provider';
import { BotController } from './bot.controller';
import { OrdersService } from '../orders/orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/order.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  providers: [BotProvider, OrdersService],
  controllers: [BotController],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class BotModule {}
