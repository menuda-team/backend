import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Model } from 'mongoose';
import {
  CategoryDocument,
  Category,
  CategoryListItem,
} from './category.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(dto);
    return createdCategory.save();
  }

  async findAll() {
    return this.categoryModel.find().exec();
  }

  async getList(): Promise<CategoryListItem[]> {
    const categories = await this.findAll();
    return categories.map(({ products, name, _id }) => ({
      productsCount: products.length,
      name,
      _id,
    }));
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  async getProducts(id: string) {
    const categoryWithProducts = await this.categoryModel
      .findById(id)
      .populate({
        path: 'products',
      });
    return categoryWithProducts.products;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
