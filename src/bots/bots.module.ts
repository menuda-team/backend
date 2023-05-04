import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './bots.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { UserSchema, User } from '../users/user.schema';
import { Order, OrderSchema } from '../orders/order.schema';
import { Cart, CartSchema } from '../carts/carts.schema';

@Module({
  controllers: [BotsController],
  providers: [BotsService, UsersService, OrdersService],
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
})
export class BotsModule {}
