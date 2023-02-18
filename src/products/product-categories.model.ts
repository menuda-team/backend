import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/categories.model';
import { Product } from './products.model';

@Table({ tableName: 'products_categories', createdAt: false, updatedAt: false })
export class ProductCategories extends Model<ProductCategories> {
  @ApiProperty()
  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID })
  readonly productId: string;

  @ApiProperty()
  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID })
  readonly categoryId: string;
}
