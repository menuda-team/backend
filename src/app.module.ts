import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProdcutsModule } from './prodcuts/prodcuts.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProdcutsModule, ProductsModule],
  controllers: [AppController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
