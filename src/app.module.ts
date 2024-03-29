import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as util from 'util';
import { OrdersModule } from './orders/orders.module';
import { BotsModule } from './bots/bots.module';
import { AdminsModule } from './admins/admins.module';
import * as process from 'process';
import { BotIdMiddleware } from './bot-id.middleware';
import { CartsModule } from './carts/carts.module';
import { ROUTES_WITH_BOT_ID_REQUIRED } from './constants';

const getDbUrl = () =>
  util.format(
    'mongodb://%s:%s@%s/',
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_HOST,
  );

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
    UsersModule,
    OrdersModule,
    BotsModule,
    AdminsModule,
    CartsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BotIdMiddleware).forRoutes(...ROUTES_WITH_BOT_ID_REQUIRED);
  }
}
