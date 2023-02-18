import {
  Model,
  BelongsToMany,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/products.model';
import { ProductCategories } from '../products/product-categories.model';
import { DataTypes } from 'sequelize';

interface CategoryCreationAttrs {
  name: string;
  products: string[];
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreationAttrs> {
  @ApiProperty({ example: 'Супы', description: 'Название категории' })
  @Column({ type: DataType.STRING, allowNull: false })
  readonly name: string;

  @ApiProperty()
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  readonly id: string;

  @ApiProperty()
  @BelongsToMany(() => Product, () => ProductCategories, 'categoryId')
  readonly products: Product[];
}
