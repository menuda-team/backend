import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto, @Query('botId') botId?: string) {
    return this.usersService.create(createUserDto, botId);
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
  getCart(@Param('id') tgId: string, @Query('botId') botId?: string) {
    return this.usersService.getCart(+tgId, botId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':tgId/remove')
  remove(@Param('tgId') tgId: string) {
    return this.usersService.remove(+tgId);
  }
}
