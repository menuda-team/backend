import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as util from 'util';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { OrdersModule } from './orders/orders.module';
import { BotsModule } from './bots/bots.module';
import { AdminsModule } from './admins/admins.module';
import * as process from 'process';
import * as fs from 'fs';

const getDbUrl = () =>
  util.format(
    'mongodb://%s:%s@%s/',
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_HOST,
  );

const getTokens = (path) =>
  fs.readFileSync(path).toString().split('\n').filter(Boolean);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(getDbUrl(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      autoCreate: true,
      tlsCAFile: process.env.CACERT,
      authSource: process.env.DB_NAME,
      replicaSet: process.env.DB_RS,
      dbName: process.env.DB_NAME,
      retryAttempts: +process.env.RETRY_ATTEMPS,
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    BotModule,
    // ...getTokens(process.env.TOKENS_FILE_PATH).map((token) =>
    //   TelegrafModule.forRoot({
    //     token,
    //     launchOptions: {
    //       webhook: {
    //         domain: process.env.BACKEND_URL,
    //         hookPath: '/bot/update',
    //         secretToken: process.env.WEBHOOK_SECRET_TOKEN,
    //       },
    //     },
    //   }),
    // ),
    OrdersModule,
    BotsModule,
    AdminsModule,
  ],
})
export class AppModule {}
