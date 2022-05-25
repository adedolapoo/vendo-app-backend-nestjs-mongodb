import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { MongooseModelModule } from '@vendor-app/core/mongooseModels.module';
import { DepositsModule } from '@vendor-app/deposits/deposits.module';
import { BuyproductsController } from './controllers/buyproducts.controller';

@Module({
  imports: [MongooseModelModule, DepositsModule],
  providers: [ProductsService],
  controllers: [ProductsController, BuyproductsController],
})
export class ProductsModule {}
