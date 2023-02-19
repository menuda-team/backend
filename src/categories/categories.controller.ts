import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AddProductsDto } from './dto/add-products.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
  //
  // @Post('/addProducts')
  // addProducts(@Body() dto: AddProductsDto) {
  //   return this.categoriesService.addProducts(dto);
  // }
  //
  // @Get(':id/products')
  // getProducts(@Param('id') id: string) {
  //   return this.categoriesService.getProducts(id);
  // }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/list')
  getList() {
    return this.categoriesService.getList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('/:id/products')
  getProducts(@Param('id') id: string) {
    return this.categoriesService.getProducts(id);
  }
  //
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}
