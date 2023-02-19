import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  readonly name: string;

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
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryListItem = Omit<Category, 'products'> & {
  productsCount: number;
};
