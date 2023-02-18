import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Model } from 'mongoose';
import { CategoryDocument, Category } from './category.schema';
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

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
  //
  // async addProducts(dto: AddProductsDto) {
  //   const category = await this.findOne(dto.categoryId);
  //   if (!category) {
  //     throw new HttpException(
  //       `Category with id ${dto.categoryId} was not found`,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   for (const productId of dto.productIds) {
  //     const product = await this.productRepository.findByPk(productId);
  //     if (!product) {
  //       throw new HttpException(
  //         `Product with id ${productId} was not found`,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     await category.$add('products', product);
  //   }
  //
  //   return dto;
  // }
  //
  // async getProducts(id: string) {
  //   return this.categoryRepository
  //     .findOne({
  //       where: {
  //         id,
  //       },
  //       include: [
  //         {
  //           model: Product,
  //         },
  //       ],
  //     })
  //     .then((category) => category.products)
  //     .catch((err) => {
  //       throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //     });
  // }
  //
  // findAll() {
  //   return this.categoryRepository.findAll();
  // }
  //
  // async findOne(id: string) {
  //   return await this.categoryRepository.findByPk(id);
  // }
  //
  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
