import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/product.schema';

export type CartDocument = HydratedDocument<Cart>;

export type CartItem = {
  product: string;
  count: number;
  price: number;
};

@Schema()
export class Cart {
  @ApiProperty()
  @Prop({
    required: true,
    default: 0,
  })
  totalAmount: number;

  @ApiProperty()
  @Prop({
    required: true,
    default: [],
    type: [
      {
        _id: false,
        product: {
          type: Types.ObjectId,
          ref: Product,
        },
        count: Number,
        price: Number,
      },
    ],
  })
  readonly items?: CartItem[];

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
    ref: 'User',
  })
  user: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Bot',
  })
  bot: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
