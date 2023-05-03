import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BotDocument = Bot & Document;

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
  })
  categories: string[];
}

export const BotSchema = SchemaFactory.createForClass(Bot);
