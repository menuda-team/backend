import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';
import { SetCartItemsCountDto } from './dto/set-cart-items-count.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }
  @Patch(':id/add')
  addToCart(@Param('id') id: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addToCart(id, addToCartDto);
  }

  @Patch(':id/remove')
  removeFromCart(
    @Param('id') id: string,
    @Body() removeFromCartDto: RemoveFromCartDto,
  ) {
    return this.cartsService.removeFromCart(id, removeFromCartDto);
  }

  @Patch(':id/set')
  setCartItemsCount(
    @Param('id') id: string,
    @Body() setCartItemsCountDto: SetCartItemsCountDto,
  ) {
    return this.cartsService.setCartItemsCount(id, setCartItemsCountDto);
  }

  @Delete('/clear')
  removeAll() {
    return this.cartsService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}
