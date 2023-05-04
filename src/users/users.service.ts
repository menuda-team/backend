import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './user.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { Cart, CartDocument } from '../carts/carts.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  async create(createUserDto: CreateUserDto, botId: string) {
    const user = await this.userModel.create(createUserDto);

    const cart = await this.cartModel.create({
      user: user.tgId,
      bot: botId,
    });

    await user.updateOne({
      $push: {
        carts: cart._id,
      },
    });

    return this.userModel.findOne({ tgId: user.tgId });
  }

  findAll() {
    return this.userModel.find();
  }

  async getOrders(tgId: number) {
    let user = await this.userModel
      .findOne({
        tgId,
      })
      .populate({
        path: 'orders',
        model: 'Order',
      });

    if (!user) {
      user = await this.userModel.create({ tgId });
    }

    return user.orders;
  }

  async getCart(tgId: number, botId: string) {
    let user = await this.userModel
      .findOne({
        tgId,
      })
      .populate<{ carts: Cart[] }>({
        path: 'carts',
        model: 'Cart',
      });

    if (!user) {
      const newUser = await this.create({ tgId }, botId);

      user = await newUser.populate<{ carts: Cart[] }>({
        path: 'carts',
        model: 'Cart',
      });
    }

    const cart = user.carts.find(({ bot }) => bot.toString() === botId);
    let cartModel;

    if (!cart) {
      cartModel = await this.cartModel.create({
        user: tgId,
        bot: botId,
      });

      user.carts.push(cartModel._id);
      user.save();
    } else {
      cartModel = new this.cartModel(cart);
    }

    return cartModel.populate({
      path: 'items.product',
      model: 'Product',
    });
  }

  async findOne(tgId: number) {
    return this.userModel.findOne({
      tgId,
    });
  }

  async findByTgId(tgId: number) {
    return this.userModel.findOne({
      tgId,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ tgId: id }, updateUserDto);
  }

  async remove(tgId: number) {
    const deletedUser = await this.userModel.findOneAndRemove({ tgId }).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with Telegram Id ${tgId} not found`);
    }
    return deletedUser;
  }
}
