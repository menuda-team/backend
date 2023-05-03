import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({
    required: true,
  })
  readonly name: string;

  @Prop({
    required: true,
    unique: true,
  })
  readonly login: string;

  @Prop({
    required: true,
  })
  readonly password: string;

  @Prop({
    unique: true,
  })
  readonly token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bot',
  })
  bot?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
