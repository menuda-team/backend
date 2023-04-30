import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from '../products/product.schema';

export type CartItem = {
  product: string;
  count: number;
  price: number;
};

export type Cart = {
  items: CartItem[];
  totalAmount: number;
};

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    required: true,
    default: {
      items: [],
      totalAmount: 0,
    },
    _id: false,
    type: {
      items: {
        _id: false,
        type: [
          {
            product: {
              type: Types.ObjectId,
              ref: Product,
            },
            count: Number,
            price: Number,
          },
        ],
      },
      totalAmount: Number,
    },
  })
  readonly cart: Cart;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  readonly tgId: number;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  })
  orders?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
