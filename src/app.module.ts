import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as util from 'util';

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
      tlsCAFile: process.env.CACERT,
      authSource: process.env.DB_NAME,
      replicaSet: process.env.DB_RS,
      autoCreate: true,
      dbName: process.env.DB_NAME,
      retryAttempts: +process.env.RETRY_ATTEMPS,
    }),
    ProductsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
