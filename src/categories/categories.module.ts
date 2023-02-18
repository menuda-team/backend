import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
})
export class CategoriesModule {}
