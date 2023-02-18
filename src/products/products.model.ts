import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories/categories.model';
import { ProductCategories } from './product-categories.model';
import { DataTypes } from 'sequelize';

interface ProductCreationAttrs {
  name: string;
  image?: File;
  weight: number;
  price: number;
  available: boolean;
  description?: string;
  salePrice?: number;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
  @ApiProperty({ example: 'Бургер', description: 'Название блюда' })
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
  @Column({ type: DataType.STRING, allowNull: true })
  readonly imageUrl: string;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: true })
  readonly weight: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  @ApiProperty()
  readonly price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @ApiProperty()
  readonly available: boolean;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: true })
  readonly description?: string;

  @ApiProperty()
  @Column({ type: DataType.FLOAT, allowNull: true })
  readonly salePrice?: number;

  @ApiProperty()
  @BelongsToMany(() => Category, () => ProductCategories, 'productId')
  readonly categories: Category[];
}
