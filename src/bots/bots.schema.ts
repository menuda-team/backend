import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Product } from '../products/product.schema';

export type BotDocument = Bot & Document;

export type Category = {
  name: string;
  products: string[];
};

export type CategoryListItem = Omit<Category, 'products'> & {
  productsCount: number;
};

export type CategoryDocument = Category & Document;

@Schema()
export class Bot {
  @Prop({
    required: true,
    unique: true,
  })
  readonly login: string;

  @Prop({
    required: true,
    unique: true,
  })
  readonly token: string;

  @Prop()
  readonly name?: string;

  @Prop()
  readonly description?: string;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  })
  products: string[];

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
      },
    ],
  })
  admins: string[];

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  })
  orders: string[];

  @Prop({
    required: true,
    type: [
      {
        name: String,
        products: {
          _id: false,
          type: [
            {
              type: Types.ObjectId,
              ref: Product,
            },
          ],
        },
      },
    ],
  })
  categories: CategoryDocument[];
}

export const BotSchema = SchemaFactory.createForClass(Bot);
