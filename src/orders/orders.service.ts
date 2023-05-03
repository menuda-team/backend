import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Model } from 'mongoose';
import { OrderDocument, Order } from './order.schema';
import { Bot, BotDocument } from '../bots/bots.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const createdOrder = new this.orderModel(createOrderDto);

    await createdOrder.save(async () => {
      await this.userModel.findOneAndUpdate(
        { tgId: createdOrder.user },
        {
          $push: {
            orders: createdOrder._id,
          },
          $set: {
            cart: {
              items: [],
              totalAmount: 0,
            },
          },
        },
      );

      await this.botModel.findByIdAndUpdate(createdOrder.bot, {
        $push: {
          orders: createdOrder._id,
        },
      });
    });

    return createdOrder.populate({
      path: 'items.product',
      model: 'Product',
    });
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(id: string) {
    return this.orderModel.findById(id).populate({
      path: 'items.product',
      model: 'Product',
    });
  }

  remove(id: string) {
    return this.orderModel.findByIdAndRemove(id).populate({
      path: 'items.product',
      model: 'Product',
    });
  }
}
