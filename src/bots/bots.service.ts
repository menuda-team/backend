import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotDocument, Bot } from './bots.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { CreateProductDto } from '../products/dto/create-product.dto';
import fs from 'fs';
import { Telegraf } from 'telegraf';

const addTokenToFile = (token: string) =>
  fs.appendFile(process.env.TOKENS_FILE_PATH, token, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

@Injectable()
export class BotsService {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async setWebhook(token: string) {
    const bot = new Telegraf(token);
    await bot.launch({
      webhook: {
        domain: process.env.BACKEND_URL,
        hookPath: `/bot/update/${token}`,
        secretToken: process.env.WEBHOOK_SECRET_TOKEN,
      },
    });
  }

  async create(body: CreateBotDto) {
    this.setWebhook(body.token).then(() =>
      console.log('!!!webhook has been set'),
    );

    const promises = body.products.map((product) =>
      this.productModel.create(product),
    );

    (await Promise.all(promises)).forEach((product) => product.save());

    const productIds = (await Promise.all(promises)).map(
      (product) => product._id,
    );

    const bot = await this.botModel.create({
      ...body,
      products: productIds,
    });

    return bot.save();
  }

  async addProduct(botId: string, createProductDto: CreateProductDto) {
    const createdProduct = await this.productModel.create(createProductDto);

    await createdProduct.save(async () =>
      this.botModel.findByIdAndUpdate(botId, {
        $push: {
          products: createdProduct._id,
        },
      }),
    );

    return createdProduct;
  }

  async getProducts(botId: string) {
    const bot = await this.botModel.findById(botId).populate({
      path: 'products',
      model: 'Product',
    });

    return bot.products;
  }

  findAll() {
    return this.botModel.find().exec();
  }

  findByLogin(login: string) {
    return this.botModel.findOne({ login }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} bot`;
  }

  update(id: number, updateBotDto: UpdateBotDto) {
    return `This action updates a #${id} bot`;
  }

  remove(id: string) {
    return this.botModel.findByIdAndRemove(id);
  }
}
