import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @ApiProperty({ example: 'Бургер', description: 'Название блюда' })
  @Prop({
    required: true,
  })
  readonly name: string;

  @ApiProperty()
  @Prop()
  readonly imageUrl: string;

  @ApiProperty()
  @Prop()
  readonly weight: number;

  @ApiProperty()
  @Prop({
    required: true,
  })
  readonly price: number;

  @ApiProperty()
  @Prop()
  readonly available: boolean;

  @ApiProperty()
  @Prop()
  readonly description?: string;

  @ApiProperty()
  @Prop()
  readonly salePrice?: number;

  @ApiProperty()
  @Prop({
    required: true,
  })
  categories?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
