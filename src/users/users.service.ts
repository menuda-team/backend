import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument, User } from './user.schema';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
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

  async getCart(tgId: number) {
    let user = await this.userModel
      .findOne({
        tgId,
      })
      .populate({
        path: 'cart.items.product',
        model: 'Product',
      });

    if (!user) {
      user = await this.userModel.create({ tgId });
    }

    return user.cart;
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

  async addToCart(tgId: number, productId: string, count: number) {
    let user = await this.userModel.findOne({
      tgId,
    });

    if (!user) {
      user = await this.userModel.create({ tgId });
    }

    // Check if the productId is a valid ObjectId
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid productId');
    }

    const cartProductIndex = user.cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    const product = await this.productModel.findById(productId);

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      // If product already exists in cart, update its quantity
      user.cart.items[cartProductIndex].count += count;
      cartItemCountResult = user.cart.items[cartProductIndex].count;
    } else {
      // If product doesn't exist in cart, add it as a new item
      user.cart.items.push({ product: productId, count, price: product.price });
      cartItemCountResult = count;
    }

    user.cart.totalAmount += count * product.price;

    await user.save();

    return {
      product,
      count: cartItemCountResult,
      price: product.price,
    };
  }

  recalculateCartTotalAmount(user: User) {
    return user.cart.items.reduce(
      (total, item) => total + item.price * item.count,
      0,
    );
  }

  async setCartItemsCount(tgId: number, productId: string, count: number) {
    let user = await this.userModel.findOne({
      tgId,
    });

    if (!user) {
      user = await this.userModel.create({ tgId });
    }

    // Check if the productId is a valid ObjectId
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid productId');
    }

    const cartProductIndex = user.cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    const product = await this.productModel.findById(productId);

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      // If product already exists in cart, update its quantity
      if (count <= 0) {
        user.cart.items.splice(cartProductIndex, 1);
      } else {
        user.cart.items[cartProductIndex].count = count;
        cartItemCountResult = user.cart.items[cartProductIndex].count;
      }
    } else {
      // If product doesn't exist in cart, add it as a new item
      user.cart.items.push({ product: productId, count, price: product.price });
      cartItemCountResult = count;
    }

    user.cart.totalAmount = this.recalculateCartTotalAmount(user);

    await user.save();

    if (cartItemCountResult) {
      return {
        product,
        count: cartItemCountResult,
        price: product.price,
      };
    }
  }

  async removeFromCart(tgId: number, productId: string, count: number) {
    let user = await this.userModel.findOne({
      tgId,
    });

    if (!user) {
      user = await this.userModel.create({ tgId });
    }

    const cartProductIndex = user.cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    let cartItemCountResult;

    if (cartProductIndex >= 0) {
      if (user.cart.items[cartProductIndex].count > 1) {
        // If product already exists in cart, update its quantity
        user.cart.items[cartProductIndex].count -= count;
        cartItemCountResult = user.cart.items[cartProductIndex].count;
      } else {
        user.cart.items.splice(cartProductIndex, 1);
      }
    }
    const product = await this.productModel.findById(productId);

    user.cart.totalAmount -= count * product.price;

    await user.save();

    if (cartItemCountResult) {
      return {
        product,
        count: cartItemCountResult,
        price: product.price,
      };
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(tgId: number) {
    const deletedUser = await this.userModel.findOneAndRemove({ tgId }).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with Telegram Id ${tgId} not found`);
    }
    return deletedUser;
  }
}
