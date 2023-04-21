import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':tgId')
  findOne(@Param('tgId') tgId: string) {
    return this.usersService.findOne(+tgId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/orders')
  getOrders(@Param('id') tgId: string) {
    return this.usersService.getOrders(+tgId);
  }

  @Get(':id/cart')
  getCart(@Param('id') tgId: string) {
    return this.usersService.getCart(+tgId);
  }

  @Patch('/:id/cart/add')
  addToCart(@Param('id') tgId: string, @Body() { productId, count = 1 }) {
    return this.usersService.addToCart(+tgId, productId, count);
  }
  @Patch('/:id/cart/set')
  setCartItemsCount(
    @Param('id') tgId: string,
    @Body() { productId, count = 1 },
  ) {
    return this.usersService.setCartItemsCount(+tgId, productId, count);
  }
  @Patch('/:id/cart/remove')
  removeFromCart(@Param('id') tgId: string, @Body() { productId, count = 1 }) {
    return this.usersService.removeFromCart(+tgId, productId, count);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':tgId/remove')
  remove(@Param('tgId') tgId: string) {
    return this.usersService.remove(+tgId);
  }
}
