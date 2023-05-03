import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Order } from './order.schema';
import { User, UserSchema } from '../users/user.schema';
import { Bot, BotSchema } from '../bots/bots.schema';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Bot.name, schema: BotSchema },
    ]),
  ],
})
export class OrdersModule {}
