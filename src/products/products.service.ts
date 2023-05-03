import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);

    await createdProduct.save(async () => {
      for (const categoryName of createProductDto.categories) {
        await this.categoryModel.findOneAndUpdate(
          { name: categoryName },
          {
            $push: {
              products: createdProduct._id,
            },
          },
        );
      }
    });

    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
