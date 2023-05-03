import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as util from 'util';
import { OrdersModule } from './orders/orders.module';
import { BotsModule } from './bots/bots.module';
import { AdminsModule } from './admins/admins.module';
import * as process from 'process';

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
    CategoriesModule,
    UsersModule,
    OrdersModule,
    BotsModule,
    AdminsModule,
  ],
})
export class AppModule {}
