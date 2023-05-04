import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/product.schema';
import { UserSchema, User } from './user.schema';
import { CartSchema, Cart } from '../carts/carts.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
})
export class UsersModule {}
