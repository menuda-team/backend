import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product, ProductSchema } from './product.schema';
import { Category } from '../categories/categories.model';
import { ProductCategories } from './product-categories.model';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from '../categories/category.schema';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  // imports: [SequelizeModule.forFeature([Product, Category, ProductCategories])],
})
export class ProductsModule {}
