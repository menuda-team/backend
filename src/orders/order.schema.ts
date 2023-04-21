import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/product.schema';

export type OrderDocument = Order & Document;

export type OrderItem = {
  product: string;
  count: number;
  price: number;
};

@Schema()
export class Order {
  @ApiProperty()
  @Prop({
    required: true,
  })
  readonly totalAmount: number;

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
  readonly items?: OrderItem[];

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
    ref: 'User',
  })
  user?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
