import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
      },
    ],
  })
  carts: string[];

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  tgId: number;

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
