import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { OrdersService } from '../orders/orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/order.schema';
import { User, UserSchema } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { Product, ProductSchema } from '../products/product.schema';
import { BotSchema, Bot } from '../bots/bots.schema';

@Module({
  providers: [
    // BotProvider,
    OrdersService,
    UsersService,
  ],
  controllers: [BotController],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Bot.name, schema: BotSchema },
    ]),
  ],
})
export class BotModule {}
