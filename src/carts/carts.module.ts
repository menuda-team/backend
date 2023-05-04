import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema, Cart } from './carts.schema';
import { User, UserSchema } from '../users/user.schema';
import { ProductSchema, Product } from '../products/product.schema';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
})
export class CartsModule {}
