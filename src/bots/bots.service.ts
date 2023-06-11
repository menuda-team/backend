import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotDocument, Bot, Category } from './bots.schema';
import { Product, ProductDocument } from '../products/product.schema';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { Telegraf } from 'telegraf';
import { CategoryListItem } from './bots.schema';

const MENU_BUTTON_TEXT = 'Меню';

@Injectable()
export class BotsService implements OnModuleInit {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async setWebhook(token: string, id: string) {
    const bot = new Telegraf(token);

    await bot.launch({
      webhook: {
        domain: process.env.BACKEND_URL,
        hookPath: `/bots/update/${token}?id=${id}`,
        secretToken: process.env.WEBHOOK_SECRET_TOKEN,
      },
    });
  }

  async setMenuButton(token: string, id: string) {
    const bot = new Telegraf(token);

    await bot.telegram.setChatMenuButton({
      menuButton: {
        type: 'web_app',
        text: MENU_BUTTON_TEXT,
        web_app: {
          url: `https://menuda.ru/menu?bot-id=${id}`,
        },
      },
    });
  }

  async onModuleInit() {
    const bots = await this.botModel.find().exec();
    const promises = bots.map(({ token, _id }) => this.setWebhook(token, _id));

    await Promise.all(promises);
  }

  async create(body: CreateBotDto) {
    const createdProducts = await Promise.all(
      body.products.map((product) => this.productModel.create(product)),
    );

    createdProducts.forEach((product) => product.save());

    const categories = createdProducts.reduce((acc, product) => {
      product.categories.forEach((categoryName) => {
        const categoryIndex = acc.findIndex(
          ({ name }) => name === categoryName,
        );

        if (categoryIndex === -1) {
          acc.push({ name: categoryName, products: [product._id] });
        } else {
          acc[categoryIndex].products.push(product._id);
        }
      });

      return acc;
    }, [] as Category[]);

    const bot = await this.botModel.create({
      ...body,
      categories,
      products: createdProducts.map(({ _id }) => _id),
    });

    await this.setWebhook(body.token, bot._id);
    await this.setMenuButton(body.token, bot._id);

    return bot.save();
  }

  async addProduct(botId: string, createProductDto: CreateProductDto) {
    const createdProduct = await this.productModel.create(createProductDto);

    const bot = await this.botModel.findById(botId);

    await createdProduct.save(async () =>
      bot.update({
        $push: {
          products: createdProduct._id,
        },
      }),
    );

    return createdProduct;
  }

  async getCategoriesList(botId: string): Promise<CategoryListItem[]> {
    const bot = await this.botModel.findById(botId);

    return bot.categories.map(({ name, products, _id }) => ({
      name,
      _id,
      productsCount: products.length,
    }));
  }

  async getProducts(botId: string) {
    const bot = await this.botModel.findById(botId).populate({
      path: 'products',
      model: 'Product',
    });

    return bot.products;
  }

  async getProductsByCategory(categoryId: string, botId: string) {
    const bot = await this.botModel.findById(botId);

    const category = bot.categories.find(
      ({ _id }) => _id.toString() === categoryId,
    );

    return await Promise.all(
      category.products.map((id) => this.productModel.findById(id)),
    );
  }

  findAll() {
    return this.botModel.find();
  }

  findByLogin(login: string) {
    return this.botModel.findOne({ login }).exec();
  }

  findById(id: string) {
    return this.botModel.findById(id).exec();
  }

  update(id: string, updateBotDto: UpdateBotDto) {
    return this.botModel.findByIdAndUpdate(updateBotDto);
  }

  remove(id: string) {
    return this.botModel.findByIdAndRemove(id);
  }
}
