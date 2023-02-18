import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { MongooseModule } from '@nestjs/mongoose';
import * as util from 'util';

const DB_NAME = 'db1';

const DB_HOSTS = ['rc1a-8ox4z31o4411bhmm.mdb.yandexcloud.net:27018'];

const DB_RS = 'rs01';
const DB_USER = 'user1';
const DB_PASS = 'password';
const CACERT = '/Users/danlaptev/.mongodb/root.crt';

const url = util.format(
  'mongodb://%s:%s@%s/',
  DB_USER,
  DB_PASS,
  DB_HOSTS.join(','),
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: CACERT,
  authSource: DB_NAME,
  replicaSet: DB_RS,
  autoCreate: true,
  dbName: DB_NAME,
};

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CategoriesModule,
    MongooseModule.forRoot(url, options),
  ],
})
export class AppModule {}
